import tiktoken
import os
import base64

from openai import AzureOpenAI
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Initialize the Azure OpenAI client
deployment = os.getenv("AZURE_OPENAI_DEPLOYMENT")
client = AzureOpenAI(
    azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"),
    api_key=os.getenv("AZURE_OPENAI_API_KEY"),
    api_version=os.getenv("AZURE_OPENAI_API_VERSION"),
)

# Define limits
total_token_limit = 4096
input_token_limit = 1500

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


def add_image_to_prompt(encoded_images):
    """
    Adds an image to the prompt text.
    """

    chat_prompt = [
        {"role": "system", "content": [{"type": "text", "text": prompt_text}]}
    ]

    model_encoding = tiktoken.encoding_for_model(deployment)
    input_token_count = (
        4 + 2
    )  # Assuming 4 tokens for the <imsystem> message and 2 tokens for the <imassistant> message
    input_token_count += len(model_encoding.encode(prompt_text))

    # Add the encoded images to the prompt based on the token limit
    user_content = []
    for i, base64_image in enumerate(encoded_images):
        image_message = {
            "type": "image_url",
            "image_url": {
                "url": f"data:image/jpeg;base64,{base64_image}",
                "detail": "high",
            },
        }

        input_token_count += 4  # Assuming 4 tokens for the <imuser> message
        input_token_count += 170  # Assuming 170 tokens for each high-detailed image URL
        if input_token_count > total_token_limit - input_token_limit:
            break

        user_content.append(image_message)

    chat_prompt.append({"role": "user", "content": user_content})

    print(f"Total tokens in prompt: {input_token_count}")
    return i, chat_prompt


def send_images_to_openai(file_prefix, images_path):
    """
    Sends a batch of images to Azure OpenAI with a prompt and retrieves the response.
    """

    # Get image path
    encoded_images = get_encoded_image(file_prefix, images_path)
    if not encoded_images:
        return None

    # Create the message with the encoded images ensuring token limit
    i, messages = add_image_to_prompt(encoded_images)
    if i == 0:
        print("No images to send.")
        return None

    print(f"Sending {i} images to OpenAI API...")
    completion = client.chat.completions.create(
        model=deployment,
        messages=messages,
        max_tokens=total_token_limit,
        temperature=0.7,
        top_p=0.95,
        frequency_penalty=0,
        presence_penalty=0,
        stop=None,
        stream=False,
    )

    response = completion.choices[0].message.content
    save_response_as_md(response, file_prefix, 0)

    # TODO Logic to wait some time before sending the next batch


def save_response_as_md(response, filename, batch_num, output_folder="output"):
    """
    Saves the response as a Markdown (.md) file.
    """

    print(
        f"Saving LLM response\n-----------------------------------\n{response}\n-----------------------------------"
    )
    os.makedirs(output_folder, exist_ok=True)
    md_file_path = os.path.join(output_folder, f"{filename}_{batch_num + 1}.md")
    with open(md_file_path, "w") as md_file:
        md_file.write(response)

    print(f"Response saved to {md_file_path}")
