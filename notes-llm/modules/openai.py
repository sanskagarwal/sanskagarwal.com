import time
import tiktoken
import os
import base64

from openai import APIConnectionError, APIStatusError, AzureOpenAI, RateLimitError
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Initialize the Azure OpenAI client
deployment = os.getenv("AZURE_OPENAI_DEPLOYMENT")
model_encoding = tiktoken.encoding_for_model("gpt-4o" if deployment == "gpt-4.1" else deployment)
client = AzureOpenAI(
    azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
    api_key=os.getenv("AZURE_OPENAI_API_KEY"),
    api_version=os.getenv("AZURE_OPENAI_API_VERSION"),
)

# Define limits
total_token_limit = 40000
completion_token_limit = 20000
image_limit = 16

# Read prompt from file
with open("prompt.txt", "r") as file:
    prompt_text = file.read()


def send_request_to_openai(messages, input_token_count):
    """
    Sends a request to Azure OpenAI.
    """
    return client.chat.completions.create(
        model=deployment,
        messages=messages,
        max_completion_tokens=min(total_token_limit - input_token_count - 100, completion_token_limit),
        temperature=0.7,
        top_p=0.95,
        frequency_penalty=0,
        presence_penalty=0,
        stop=None,
        stream=True,
    )


def get_encoded_image(file_prefix, images_path):
    """
    Encodes images from the specified path with the given prefix to base64.
    """
    filtered_files = [
        file for file in images_path if os.path.basename(file).startswith(file_prefix)
    ]
    if not filtered_files:
        print(f"No images found with prefix: {file_prefix}")
        return None

    print(f"Found {len(filtered_files)} images with prefix: {file_prefix}")
    encoded_images = []
    for image_path in filtered_files:
        with open(image_path, "rb") as image:
            encoded_image = base64.b64encode(image.read()).decode("utf-8")
            encoded_images.append(encoded_image)

    return encoded_images


def add_image_to_prompt(encoded_images, image_index):
    """
    Adds up to limit images to the prompt text.
    """

    chat_prompt = [
        {"role": "system", "content": [{"type": "text", "text": prompt_text}]},
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": f"We have converted {image_index} pages out of {len(encoded_images)} pages so far.",
                }
            ],
        },
    ]

    input_token_count = 2  # Assuming 2 tokens for the <imassistant> message
    for message in chat_prompt:
        if "content" in message:
            for content_item in message["content"]:
                if content_item["type"] == "text":
                    input_token_count += len(
                        model_encoding.encode(content_item["text"])
                    )

        input_token_count += 4  # Assuming 4 tokens for the <imuser> message

    # Add the encoded images to the prompt based on the token limit
    user_content = []
    for i in range(image_index, min(image_index + image_limit, len(encoded_images))):
        base64_image = encoded_images[i]
        image_message = {
            "type": "image_url",
            "image_url": {"url": f"data:image/jpeg;base64,{base64_image}"},
        }

        input_token_count += 4  # Assuming 4 tokens for the <imuser> message
        input_token_count += 85  # 85 base tokens for each image URL
        input_token_count += 170 * 6  # 6 tiles for scanned image
        user_content.append(image_message)

    chat_prompt.append({"role": "user", "content": user_content})
    print(f"Total tokens in prompt: {input_token_count}")
    return chat_prompt, input_token_count


def send_images_to_openai(file_prefix, images_path, requested_batch_number=None):
    """
    Sends a batch of images to Azure OpenAI with a prompt and retrieves the response.
    """

    batch_num = 1
    encoded_images = get_encoded_image(file_prefix, images_path)
    if not encoded_images:
        return None

    for image_index in range(0, len(encoded_images), image_limit):
        print(f"-----------------------------------\nProcessing batch {batch_num}...")

        # Create the message with the encoded images ensuring token limit (4 images max)
        messages, input_token_count = add_image_to_prompt(encoded_images, image_index)

        if requested_batch_number is not None and batch_num < requested_batch_number:
            print(f"Skipping batch {batch_num} as per request.")
            batch_num += 1
            continue

        # Use the retry-enabled function to send the request
        print(f"Sending request to Azure OpenAI for batch {batch_num}...")
        try:
            completion_response = send_request_to_openai(messages, input_token_count)
            response = ""
            for update in completion_response:
                if update.choices:
                    print(update.choices[0].delta.content or "", end="")
                    response += update.choices[0].delta.content or ""
            print("\nRequest completed.")
            print(f"Response tokens: {len(model_encoding.encode(response))}")
            save_response_as_md(response, file_prefix, batch_num)
        except APIConnectionError as e:
            print("The server could not be reached")
            print(e.__cause__)  # an underlying Exception, likely raised within httpx.
            return None
        except RateLimitError as e:
            print("A 429 status code was received; retries didn't work.")
            print(e.response.text)
            print(e.response.headers)
            return None
        except APIStatusError as e:
            print(e.status_code)
            print(e.response.text)
            return None
        except Exception as e:
            print("An unexpected error occurred.")
            print(e)
            return None

        batch_num += 1
        print("Sleeping for 60 seconds...\n")
        time.sleep(60)  # Sleep for 60 seconds to avoid hitting the rate limit


def save_response_as_md(response, filename, batch_num, output_folder="output"):
    """
    Saves the response as a Markdown (.md) file.
    """

    print("Saving LLM response\n-----------------------------------\n")
    os.makedirs(output_folder, exist_ok=True)
    md_file_path = os.path.join(output_folder, f"{filename}_{batch_num}.md")
    with open(md_file_path, "w") as md_file:
        md_file.write(response)

    print(f"Response saved to {md_file_path}")
