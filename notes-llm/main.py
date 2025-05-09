from modules.pdf import pdf_to_images, download_pdf
from modules.openai import send_images_to_openai


def main():
    pdf_url = input("Enter the PDF URL: ")

   # Optional input for batch number
    batch_number_input = input("Enter the batch number (or press Enter to process all batches): ")
    batch_number = int(batch_number_input) if batch_number_input.strip() else None

    # Step 1: Download the PDF
    pdf_filename, pdf_path = download_pdf(pdf_url)

    # Step 2: Convert PDF to images
    images_path = pdf_to_images(pdf_path)

    # Step 3: Send images in batches Azure OpenAI
    send_images_to_openai(pdf_filename, images_path, batch_number)


if __name__ == "__main__":
    main()
