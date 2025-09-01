<template>
  <div class="bg-gray-100 font-sans min-h-screen py-20 flex flex-col items-center justify-center">

    <!-- Loading Overlay for better user feedback -->
    <div 
      v-if="isGenerating" 
      class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
    >
      <div class="text-white text-2xl font-bold p-8 bg-gray-800 bg-opacity-70 rounded-lg">
        Generating Your Voucher...
      </div>
    </div>

    <div class="text-center">
      <h1 class="text-3xl font-bold mb-2">Booking Voucher Ready</h1>
      <p class="text-gray-600 mb-6">Click the button below to download your voucher as a PDF.</p>
      <button 
        @click="downloadPDF" 
        :disabled="isGenerating"
        class="bg-teal-600 text-white font-bold py-4 px-8 text-lg rounded-lg shadow-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 transition-all duration-300 ease-in-out disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {{ isGenerating ? 'Please Wait...' : 'Download PDF Voucher' }}
      </button>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue';

// State to manage the loading overlay and button
const isGenerating = ref(false);

// This is the main function that creates and downloads the PDF
const downloadPDF = async () => {
  if (isGenerating.value) return;
  isGenerating.value = true;
  console.log("PDF generation process started.");

  try {
    // 1. DYNAMICALLY IMPORT THE LIBRARY
    const { default: html2pdf } = await import('html2pdf.js');
    console.log("html2pdf.js library loaded.");

    // 2. DEFINE THE BOOKING DATA
    // In a real app, this data would come from your API or state management
    const booking = {
      hotelName: 'DIYAR AL NAKHEEL',
      hotelAddress: 'As Salam Rd, Al Naqa, Madinah 42311, Saudi Arabia',
      hotelPhone: '+966 148192450',
      checkin: '2025-04-16',
      checkout: '2025-04-19',
      roomType: 'QUINTUPLE ROOM - 1 ROOM',
      boardBasis: 'Breakfast, Lunch, Dinner Included',
      roomQuantity: '1 ROOM(S)',
      travelers: [
        { firstName: 'Abdullah', lastName: 'Syed', type: 'Adult', photo: null },
        { firstName: 'Rahamath', lastName: 'Syed', type: 'Adult', photo: null },
        { firstName: 'Rabiya Faheem', lastName: 'Syed', type: 'Adult', photo: null },
        { firstName: 'Siraj Sohail', lastName: 'Syed', type: 'Adult', photo: null },
        { firstName: 'Fatima', lastName: 'Shaikh', type: 'Adult', photo: null },
      ],
      // You can add image URLs here if you have them
      logo: null, 
      hotelImage: 'https://via.placeholder.com/300x200.png?text=Hotel+Image',
      qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BookingConfirmed'
    };

    // 3. GENERATE THE HTML CONTENT
    const htmlContent = getHtmlContent(booking);
    console.log("HTML content for PDF has been generated.");

    // 4. CONFIGURE PDF OPTIONS
    const options = {
      margin: 0, // No margin, as the HTML has its own padding
      filename: 'LetsGoMakkah-Booking-Voucher.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    // 5. EXECUTE PDF GENERATION
    await html2pdf().from(htmlContent).set(options).save();
    console.log("PDF generation successful.");

  } catch (error) {
    console.error("An error occurred during PDF generation:", error);
    alert("Sorry, an error occurred while creating the PDF. Please check the console for details.");
  } finally {
    isGenerating.value = false;
    console.log("PDF generation process finished. UI has been reset.");
  }
};

// HELPER FUNCTION TO GENERATE THE HTML STRING
function getHtmlContent(booking) {
    
    // Helper to format dates
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString('en-GB', options);
    };

    // Helper to calculate nights
    const calculateNights = (start, end) => {
        if (!start || !end) return 0;
        const startDate = new Date(start);
        const endDate = new Date(end);
        const diffTime = Math.abs(endDate - startDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        return diffDays;
    };
  
    // This function generates the list of travelers
    const generateTravelerRows = (travelers) => {
      if (!travelers || travelers.length === 0) {
        return '<tr><td colspan="5" style="text-align:center;">No traveler details provided.</td></tr>';
      }
      return travelers.map((traveler, index) => `
        <tr>
          <td class="photo-cell">
            ${traveler.photo ? `<img src="${traveler.photo}" alt="${traveler.firstName}" class="traveler-photo" onerror="this.style.display='none'">` : '<div style="width:40px;height:40px;background:#ddd;border-radius:50%;display:inline-block;"></div>'}
          </td>
          <td>Traveler ${index + 1}</td>
          <td>${traveler.firstName}</td>
          <td>${traveler.lastName}</td>
          <td>${traveler.type}</td>
        </tr>
      `).join('');
    };

    // The full HTML template provided by you, wrapped in a JavaScript template literal
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Booking Confirmation</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; background: #f8f9fa; }
          .container { max-width: 800px; margin: 0 auto; background: white; }
          .header { background: linear-gradient(135deg, #20b2aa, #17a2b8); color: white; padding: 30px; }
          .header h1 { font-size: 28px; margin-bottom: 5px; }
          .header .subtitle { font-size: 16px; opacity: 0.9; }
          .hotel-info { background: #20b2aa; color: white; padding: 20px 30px; display: flex; justify-content: space-between; align-items: center; position: relative; }
          .hotel-image { position: absolute; top: -50px; right: 20px; width: 140px; height: 100px; border-radius: 8px; object-fit: cover; border: 4px solid white; box-shadow: 0 4px 15px rgba(0,0,0,0.2); }
          .logo { width: 60px; height: 60px; object-fit: contain; background: rgba(255,255,255,0.1); border-radius: 8px; padding: 8px; }
          .qr-code { width: 80px; height: 80px; background: white; padding: 5px; border-radius: 8px; }
          .traveler-photo { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; border: 2px solid #20b2aa; }
          .hotel-name { font-size: 24px; font-weight: bold; }
          .hotel-address { font-size: 14px; opacity: 0.9; }
          .content { padding: 30px; }
          .section { margin-bottom: 30px; }
          .section-title { font-size: 20px; font-weight: bold; color: #2c3e50; margin-bottom: 15px; padding-bottom: 8px; border-bottom: 2px solid #20b2aa; }
          .booking-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; }
          .info-item { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #eee; }
          .info-label { font-weight: 600; color: #555; }
          .info-value { font-weight: 500; color: #333; text-align: right; }
          .travelers-table { width: 100%; border-collapse: collapse; margin-top: 15px; }
          .travelers-table th { background: #f1f5f9; color: #334155; padding: 12px; text-align: left; font-weight: 600; }
          .travelers-table td { padding: 12px; border-bottom: 1px solid #eee; }
          .travelers-table tr:nth-child(even) { background: #f8f9fa; }
          .instructions { background: #f8f9fa; border-left: 4px solid #20b2aa; padding: 20px; margin: 20px 0; border-radius: 4px; }
          .instructions h3 { color: #2c3e50; margin-bottom: 15px; }
          .instructions ul { list-style: none; padding: 0; }
          .instructions li { margin: 8px 0; padding-left: 20px; position: relative; }
          .instructions li:before { content: "•"; color: #20b2aa; font-weight: bold; position: absolute; left: 0; }
          .footer { background: #2c3e50; color: white; padding: 30px; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div style="display: flex; align-items: center; gap: 15px;">
              ${booking.logo ? `<img src="${booking.logo}" alt="Logo" class="logo" onerror="this.style.display='none'">` : ''}
              <div>
                <h1>Let's Go Makkah.</h1>
                <div class="subtitle">Booking Confirmation</div>
              </div>
            </div>
          </div>
          <div class="hotel-info">
            <div>
              <div class="hotel-name">${booking.hotelName}</div>
              <div class="hotel-address">${booking.hotelAddress}</div>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 14px;">Contact</div>
              <div>${booking.hotelPhone}</div>
            </div>
            ${booking.hotelImage ? `<img src="${booking.hotelImage}" alt="Hotel" class="hotel-image" onerror="this.style.display='none'">` : ''}
          </div>
          <div class="content">
            <div class="section">
              <h2 class="section-title">Booking Details</h2>
              <div class="booking-grid">
                <div>
                  <div class="info-item"><span class="info-label">Check-in</span><span class="info-value">${formatDate(booking.checkin)} | 4:00 PM</span></div>
                  <div class="info-item"><span class="info-label">Check-out</span><span class="info-value">${formatDate(booking.checkout)} | 2:00 PM</span></div>
                  <div class="info-item"><span class="info-label">Stay</span><span class="info-value">${calculateNights(booking.checkin, booking.checkout)} Night(s)</span></div>
                </div>
                <div>
                  <div class="info-item"><span class="info-label">Room Type</span><span class="info-value">${booking.roomType}</span></div>
                  <div class="info-item"><span class="info-label">Board Basis</span><span class="info-value">${booking.boardBasis}</span></div>
                  <div class="info-item"><span class="info-label">Room Quantity</span><span class="info-value">${booking.roomQuantity}</span></div>
                </div>
              </div>
            </div>
            <div class="section">
              <h2 class="section-title">Travelers</h2>
              <table class="travelers-table">
                <thead><tr><th>Photo</th><th>Traveler</th><th>First Name</th><th>Last Name</th><th>Type</th></tr></thead>
                <tbody>${generateTravelerRows(booking.travelers)}</tbody>
              </table>
            </div>
            <div class="section">
              <div class="instructions">
                <h3>Check-in / Check-out Instructions</h3>
                <ul>
                  <li>Government-issued photo ID and a credit card or cash deposit are required at check-in.</li>
                  <li>Special requests are subject to availability and may incur additional charges.</li>
                  <li>The name on the credit card used at check-in must be the primary name on the reservation.</li>
                  <li>This property doesn't offer after-hours check-in.</li>
                </ul>
              </div>
            </div>
          </div>
          <div class="footer">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div><p style="font-size: 18px;">Thank you for your booking!</p></div>
              ${booking.qrCode ? `<img src="${booking.qrCode}" alt="QR Code" class="qr-code" onerror="this.style.display='none'">` : ''}
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
}
</script>

<style>
/* You can keep this CDN link if other parts of your app use Tailwind */
@import url('https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css');
</style>