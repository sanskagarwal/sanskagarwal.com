import tiktoken
import os
import base64

from openai import AzureOpenAI
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Initialize the Azure OpenAI client
deployment = os.getenv("AZURE_OPENAI_DEPLOYMENT")
model_encoding = tiktoken.encoding_for_model(deployment)
client = AzureOpenAI(
    azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
    api_key=os.getenv("AZURE_OPENAI_API_KEY"),
    api_version=os.getenv("AZURE_OPENAI_API_VERSION"),
)

# Define limits
total_token_limit = 4096
input_token_limit = 1600

# Read prompt from file
with open("prompt.txt", "r") as file:
    prompt_text = file.read()


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
    Adds an image to the prompt text.
    """

    chat_prompt = [
        {"role": "system", "content": [{"type": "text", "text": prompt_text}]},
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": f"We have converted {image_index} pages so far.",
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
    for i in range(image_index, len(encoded_images)):
        base64_image = encoded_images[i]
        image_message = {
            "type": "image_url",
            "image_url": {
                "url": f"data:image/jpeg;base64,{base64_image}",
                "detail": "high",
            },
        }

        input_token_count += 4  # Assuming 4 tokens for the <imuser> message
        input_token_count += 170  # Assuming 170 tokens for each high-detailed image URL
        if input_token_count > input_token_limit:
            # Remove the last image
            i -= 1
            input_token_count -= 4
            input_token_count -= 170
            break

        user_content.append(image_message)

    chat_prompt.append({"role": "user", "content": user_content})
    print(f"Total tokens in prompt: {input_token_count}")
    return i, chat_prompt


def send_images_to_openai(file_prefix, images_path):
    """
    Sends a batch of images to Azure OpenAI with a prompt and retrieves the response.
    """

    batch_num = 1
    image_index = 0
    encoded_images = get_encoded_image(file_prefix, images_path)
    if not encoded_images:
        return None

    while image_index < len(images_path):
        print(
            f"-----------------------------------\nProcessing batch {batch_num}..."
        )

        # Create the message with the encoded images ensuring token limit
        new_image_index, messages = add_image_to_prompt(encoded_images, image_index)
        images_to_send = new_image_index - image_index + 1
        if images_to_send == 0:
            print("No images to send.")
            return None

        print(f"Sending {images_to_send} images to OpenAI API...")
        # completion = client.chat.completions.create(
        #     model=deployment,
        #     messages=messages,
        #     max_tokens=total_token_limit,
        #     temperature=0.7,
        #     top_p=0.95,
        #     frequency_penalty=0,
        #     presence_penalty=0,
        #     stop=None,
        #     stream=False,
        # )

        # response = completion.choices[0].message.content
        # print(f"Response tokens: {len(model_encoding.encode(response))}")
        # save_response_as_md(response, file_prefix, batch_num)

        # Wait for the next batch
        print("Waiting for the next batch...")
        batch_num += 1
        image_index = new_image_index + 1


def save_response_as_md(response, filename, batch_num, output_folder="output"):
    """
    Saves the response as a Markdown (.md) file.
    """

    print(
        f"Saving LLM response\n-----------------------------------\n{response}\n-----------------------------------"
    )
    os.makedirs(output_folder, exist_ok=True)
    md_file_path = os.path.join(output_folder, f"{filename}_{batch_num}.md")
    with open(md_file_path, "w") as md_file:
        md_file.write(response)

    print(f"Response saved to {md_file_path}")
