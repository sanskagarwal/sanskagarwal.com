import os
import requests
import pymupdf


def download_pdf(pdf_url, output_folder="input"):
    """
    Downloads a PDF from a given URL and saves it to the input folder.
    """

    print(f"Downloading PDF from {pdf_url}...")

    # Create the input folder if it doesn't exist
    os.makedirs(output_folder, exist_ok=True)
    response = requests.get(pdf_url)
    if response.status_code == 200:
        filename = pdf_url.split("/")[-1]
        pdf_path = os.path.join(output_folder, filename)

        # Save the PDF to the specified path
        with open(pdf_path, "wb") as pdf_file:
            pdf_file.write(response.content)
        print(f"PDF downloaded successfully: {pdf_path}")
    else:
        raise Exception(f"Failed to download PDF. Status code: {response.status_code}")
    return filename, pdf_path


def pdf_to_images(pdf_path, output_folder="images"):
    """
    Converts a PDF into images, one image per page.
    """

    print(f"Converting PDF to images: {pdf_path}...")

    # Create the images folder if it doesn't exist
    os.makedirs(output_folder, exist_ok=True)
    pdf_document = pymupdf.open(pdf_path)
    image_paths = []

    for page_num in range(len(pdf_document)):
        page = pdf_document[page_num]
        pix = page.get_pixmap()
        filename = os.path.basename(pdf_path)
        image_path = os.path.join(output_folder, f"{filename}_{page_num + 1}.png")
        pix.save(image_path)
        image_paths.append(image_path)

    pdf_document.close()
    print(f"Converted {len(image_paths)} pages to images.")
    return image_paths
