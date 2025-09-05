# Nuxt.js PDF Voucher Generator & Email Sender

This project is a complete example of how to build a professional booking voucher system using Nuxt.js. It demonstrates three key features: generating a high-quality PDF from HTML, sending that PDF as an email attachment using Postmark, and detecting the user's location from their IP address.

The entire application is designed to be secure and efficient, making it ready for deployment on modern hosting platforms like Cloudflare.

## Core Features

*   **High-Fidelity PDF Generation:** Creates a professional, multi-page PDF booking voucher directly in the user's browser.
*   **Secure Email Sending:** Uses Postmark to send the generated PDF as an email attachment. The process is secure, meaning your secret API keys are never exposed to the public.
*   **User Location Detection:** Fetches the user's IP address and location information from a public API and displays it on the page.
*   **Client-Side Logic:** All user-specific tasks (PDF generation, location detection) happen in the user's browser, which is efficient and scalable.

## How to Use

Follow these steps to get the project running on your local machine.

**Step 1: Prerequisites**
Make sure you have Node.js installed on your computer. You can download it from [nodejs.org](https://nodejs.org/).

**Step 2: Get the Code**
Download or clone the project files to a folder on your computer.

**Step 3: Install Dependencies**
Open your terminal or command prompt, navigate into the project folder, and run the following command. This will download all the necessary libraries the project needs to work.

```bash
npm install
```

**Step 4: Configure Your Secret Keys**
This is the most important step for making the email feature work.

1.  In the main project folder, create a new file and name it `.env`.
2.  Copy the following text into your new `.env` file.

    ```
    # Get this from your Postmark Account -> Servers -> API Tokens
    POSTMARK_SERVER_TOKEN="YOUR_POSTMARK_SERVER_TOKEN"
    ```

3.  Replace `"YOUR_POSTMARK_SERVER_TOKEN"` with your actual Server API Token from your Postmark account.
4.  Open the file `server/api/send-voucher.post.ts`. On line 19, change `"your-verified-email@yourdomain.com"` to the actual email address you have verified with Postmark.

This `.env` file is kept secret and should never be shared publicly. It allows your server to securely connect to Postmark without exposing your key in the browser.

**Step 5: Run the Project**
In your terminal, run the following command to start the development server.

```bash
npm run dev
```

**Step 6: Open and Test**
Open your web browser and go to `http://localhost:3000`. You will see the main page.
*   The location information should appear automatically.
*   You can type an email into the input box and click "Send Email" to test the full PDF generation and sending process.

## How It Works: Key Concepts Explained

This project uses a specific architecture to be both secure and fast. Here is a breakdown of the main concepts.

**Generating the PDF**

Instead of trying to convert the visible web page into a PDF (which can be unreliable), we build a perfect HTML document as a simple string of text. This HTML has all its styles self-contained.

We then give this HTML string to the `html2pdf.js` library, which acts like a mini-browser to render the HTML and save it as a PDF. This method is highly reliable and avoids problems with complex web page layouts.

**Sending the Email (The Secure Way)**

We split the work between the Frontend (what happens in the user's browser) and the Backend (what happens on our server).

1.  **On the Frontend (`app.vue`):**
    *   The user clicks "Send Email".
    *   The `html2pdf.js` library generates the PDF file but does **not** download it.
    *   Instead, it converts the entire PDF into a long string of text called a **Base64 string**.
    *   The browser then sends the recipient's email and this PDF text string to our secure backend API.

2.  **On the Backend (`server/api/send-voucher.post.ts`):**
    *   This is a secure, private environment. Only our server can run this code.
    *   It receives the email and the PDF text string from the frontend.
    *   It safely reads your `POSTMARK_SERVER_TOKEN` from the `.env` file.
    *   It connects to Postmark using this secret key and tells it to send an email, attaching the PDF.

This process ensures your Postmark API key is **never exposed** to the user's browser, which is critical for security.

**Detecting User Location**

To get the user's location, we need their IP address.

*   **The Tool (`useFetch`):** We use Nuxt's built-in `useFetch` function, which is a smart tool for getting data from APIs. It automatically handles loading and error states for us.

*   **The Critical Setting (`server: false`):** This is the most important part. We tell `useFetch` to run **only** in the user's browser. If we did not do this, the code would run on our server (e.g., Cloudflare), and we would get the location of the Cloudflare data center, not the user. By running it in the browser, the `ipapi.co` service sees the user's actual IP address and returns their correct location.

## File Structure

Here are the most important files in the project:

*   **`app.vue`**
    This is the main file for the user interface. It contains the HTML for the page, the logic for the email input, and the code to call the PDF generator and the location API.

*   **`server/api/send-voucher.post.ts`**
    This is our secure backend API route. Its only job is to receive data from the frontend, connect to Postmark with the secret key, and send the email.

*   **`.env`**
    This file holds your secret API keys. It is listed in the `.gitignore` file so it will not be accidentally uploaded to a public repository.

*   **`package.json`**
    This file lists all the project's dependencies (like Nuxt, Postmark, and html2pdf.js).
