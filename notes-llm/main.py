from modules.pdf import pdf_to_images, download_pdf
from modules.openai import send_images_to_openai

def main():
    pdf_url = "https://sanskagarwalstorage.blob.core.windows.net/public/notes/Azure Functions Notes.pdf" # input("Enter the PDF URL: ")

    # Step 1: Download the PDF
    pdf_filename, pdf_path = download_pdf(pdf_url)

    # Step 2: Convert PDF to images
    images_path = pdf_to_images(pdf_path, "images")

    # Step 3: Send images in batches Azure OpenAI
    send_images_to_openai(pdf_filename, images_path)

if __name__ == "__main__":
    main()

# https://sanskagarwalstorage.blob.core.windows.net/public/notes/Azure Functions Notes.pdf
