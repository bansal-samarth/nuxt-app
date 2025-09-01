<template>
  <div class="bg-slate-100 font-sans min-h-screen py-20 flex flex-col items-center justify-center">

    <!-- Loading Overlay (used by the email sending process) -->
    <div 
      v-if="isLoading" 
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm"
    >
      <div class="text-white text-2xl font-bold p-8 bg-gray-800 bg-opacity-70 rounded-lg shadow-xl">
        {{ loadingMessage }}
      </div>
    </div>

    <!-- Main Content Card -->
    <div class="text-center max-w-2xl bg-white p-10 rounded-xl shadow-lg">
      <h1 class="text-4xl font-bold text-slate-800 mb-4">Finalize Your Booking</h1>
      <p class="text-slate-600 mb-8">You can download the voucher directly or send it as a PDF attachment to an email address.</p>
      
      <!-- =============================================================== -->
      <!-- ================== NEW: Location Info Section ================= -->
      <!-- =============================================================== -->
      <div class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-left">
        <p class="font-semibold text-blue-800 mb-3">Your Detected Location (for confirmation):</p>
        
        <!-- Loading State -->
        <div v-if="isLocationLoading">
          <p class="text-slate-500 animate-pulse">Fetching location data...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="locationError">
          <p class="text-red-600 font-medium">Could not fetch location data. Please try refreshing.</p>
        </div>

        <!-- Success State -->
        <div v-else-if="locationData" class="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
          <span class="font-semibold text-slate-600">IP Address:</span>
          <span class="text-slate-800 font-mono">{{ locationData.ip }}</span>
          
          <span class="font-semibold text-slate-600">City:</span>
          <span class="text-slate-800">{{ locationData.city }}</span>

          <span class="font-semibold text-slate-600">Region:</span>
          <span class="text-slate-800">{{ locationData.region }}</span>

          <span class="font-semibold text-slate-600">Country:</span>
          <span class="text-slate-800">{{ locationData.country_name }} ({{ locationData.country_code }})</span>
        </div>
      </div>
      <!-- =============================================================== -->
      <!-- ===================== End of New Section ====================== -->
      <!-- =============================================================== -->

      <!-- Email Sending Section (Unchanged) -->
      <div class="border-t border-slate-200 pt-8 mt-8">
        <label for="email" class="block text-lg font-semibold text-slate-700 mb-2">Send Voucher via Email</label>
        <div class="flex flex-col sm:flex-row gap-4 items-center">
          <input
            v-model="recipientEmail"
            type="email"
            id="email"
            placeholder="Enter recipient's email address"
            class="flex-grow w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-4 focus:ring-teal-500/30 focus:border-teal-500 transition"
          />
          <button 
            @click="handleSendEmail" 
            :disabled="isLoading || !recipientEmail"
            class="w-full sm:w-auto bg-teal-500 text-white font-bold py-3 px-6 text-base rounded-lg shadow-lg hover:bg-teal-600 focus:outline-none focus:ring-4 focus:ring-teal-500/30 transition-all disabled:bg-slate-400 disabled:cursor-not-allowed"
          >
            Send Email
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue';

// --- STATE MANAGEMENT for PDF/Email (Unchanged) ---
const recipientEmail = ref('');
const isLoading = ref(false);
const loadingMessage = ref('');

// --- NEW: State Management & Data Fetching for Location ---
// `useFetch` is a powerful Nuxt composable that handles loading, error, and data states for us.
const { 
  data: locationData, 
  pending: isLocationLoading, 
  error: locationError 
} = useFetch('https://ipapi.co/json/', {
  // `lazy: true` means the page doesn't block rendering while waiting for this data.
  lazy: true,
  // `server: false` is CRITICAL. It ensures this API call only ever runs on the client-side (the browser),
  // so we get the *user's* IP, not the server's IP.
  server: false
});

// --- CORE LOGIC for PDF/Email (Unchanged) ---
const handleSendEmail = async () => {
  if (!recipientEmail.value || isLoading.value) return;

  isLoading.value = true;
  loadingMessage.value = 'Generating PDF...';

  try {
    const { default: html2pdf } = await import('html2pdf.js');
    const bookingData = getBookingData();
    const htmlContent = getVoucherHtml(bookingData);

    const pdfBase64 = await html2pdf().from(htmlContent).set(getPdfOptions(bookingData)).output('datauristring');
    const cleanBase64 = pdfBase64.split(',')[1];
    
    loadingMessage.value = 'Sending Email...';
    
    await $fetch('/api/send-voucher', {
      method: 'POST',
      body: {
        recipientEmail: recipientEmail.value,
        pdfBase64: cleanBase64,
        confirmationNumber: bookingData.confirmationNumber
      }
    });

    alert(`Voucher successfully sent to ${recipientEmail.value}!`);
    recipientEmail.value = '';

  } catch (error) {
    console.error("An error occurred:", error);
    alert("Sorry, an error occurred. Please check the console for details.");
  } finally {
    isLoading.value = false;
    loadingMessage.value = '';
  }
};

// --- HELPER FUNCTIONS (Unchanged) ---

const getPdfOptions = (data) => ({
  margin: 0,
  filename: `BookingVoucher_${data.confirmationNumber}.pdf`,
  image: { type: 'jpeg', quality: 1.0 },
  html2canvas: { scale: 2, useCORS: true },
  jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
  pagebreak: { mode: ['css'] }
});

const getBookingData = () => ({
  confirmationNumber: 'LGM-84B9C2',
  hotelName: 'DIYAR AL NAKHEEL',
  hotelAddress: 'As Salam Rd, Al Naqa, Madinah 42311, Saudi Arabia',
  hotelPhone: '+966 148192450',
  hotelImageUrl: 'https://i.imgur.com/8a4V94a.jpg',
  checkinDate: '16/04/2025',
  checkoutDate: '19/04/2025',
  checkinTime: '4:00 PM',
  checkoutTime: '2:00 PM',
  stayDuration: '3 Night(s)',
  roomType: 'QUINTUPLE ROOM - 1 ROOM',
  roomDetails: '5 Adults, Breakfast, Lunch, Dinner Included',
  travelers: [{ travelerNumber: 1, firstName: 'Abdullah', lastName: 'Syed', type: 'Adult' }, { travelerNumber: 2, firstName: 'Rahamath', lastName: 'Syed', type: 'Adult' }, { travelerNumber: 3, firstName: 'Rabiya Faheem', lastName: 'Syed', type: 'Adult' }, { travelerNumber: 4, firstName: 'Siraj Sohail', lastName: 'Syed', type: 'Adult' }, { travelerNumber: 5, firstName: 'Fatima', lastName: 'Shaikh', type: 'Adult' }],
  instructions: { checkinTimeRange: '4:00 PM - 9:00 PM', checkoutTimeFixed: '2:00 PM', points: ['Extra-person charges may apply and vary depending on property policy', 'Government-issued photo identification and a credit card, debit card, or cash deposit may be required at check-in for incidental charges', 'Special requests are subject to availability upon check-in and may incur additional charges; special requests cannot be guaranteed', 'The name on the credit card used at check-in to pay for incidentals must be the primary name on the guestroom reservation', 'This property accepts credit cards, mobile payments, and cash', 'Mobile payment options include: Apple Pay, Huawei Pay, and Samsung Pay', 'This property reserves the right to pre-authorize the guest\'s credit card prior to arrival.', 'Cashless transactions are available', 'Please note that cultural norms and guest policies may differ by country and by property; the policies listed are provided by the property'], finalNote: 'This property doesn\'t offer after-hours check-in. Front desk staff will greet guests on arrival.' },
  amenities: 'Features at this hotel include complimentary wireless internet access and concierge services'
});

function getVoucherHtml(data) {
    const travelerRows = data.travelers.map(t => `<tr class="traveler-row"><td>Traveller ${t.travelerNumber}</td><td>${t.firstName}</td><td>${t.lastName}</td><td>${t.type}</td></tr>`).join('');
    const instructionPoints = data.instructions.points.map(p => `<li>${p}</li>`).join('');
    return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Booking Voucher ${data.confirmationNumber}</title><style>@import url('https://fonts.googleapis.com/css2?family=Public+Sans:wght@400;600;700&display=swap');:root{--brand-teal:#0F9D8F;--border-purple:#E9D5FF;--text-dark:#1E293B;--text-medium:#475569;--bg-page:#F1F5F9;--bg-white:#FFFFFF;}*{margin:0;padding:0;box-sizing:border-box;}body{font-family:'Public Sans',-apple-system,sans-serif;background-color:var(--bg-page);}.voucher-container{max-width:800px;margin:40px auto;background-color:var(--bg-white);}.header{background-color:var(--brand-teal);color:var(--bg-white);padding:30px 40px;display:flex;justify-content:space-between;align-items:center;}.header-text h1{font-size:32px;font-weight:700;}.header-text h2{font-size:24px;font-weight:600;opacity:0.9;margin-top:5px;}.header-image img{width:150px;height:100px;object-fit:cover;border-radius:8px;border:3px solid white;}.address-bar{background-color:#0d8a7e;color:var(--bg-white);padding:12px 40px;display:flex;justify-content:space-between;align-items:center;font-size:14px;font-weight:600;}.content-area{padding:40px;}.section-title{font-size:20px;font-weight:700;color:var(--text-dark);padding-bottom:10px;margin-bottom:25px;border-bottom:2px solid var(--border-purple);}.booking-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:20px 40px;margin-bottom:40px;}.info-block .label{font-size:15px;font-weight:600;color:var(--text-medium);margin-bottom:6px;}.info-block .value{font-size:16px;color:var(--text-dark);}.room-info-block{grid-column:1 / -1;margin-top:15px;background-color:#F8FAFC;padding:15px;border-radius:6px;border:1px solid #E2E8F0;}.travelers-table{width:100%;border-collapse:collapse;margin-bottom:40px;}.travelers-table th{background-color:var(--brand-teal);color:var(--bg-white);text-align:left;padding:12px 15px;font-weight:600;}.travelers-table td{padding:12px 15px;border-bottom:1px solid #E2E8F0;}.travelers-table tr:last-child td{border-bottom:none;}.instructions-section p{margin-bottom:15px;color:var(--text-medium);}.instructions-section ul{list-style-position:outside;padding-left:20px;}.instructions-section li{margin-bottom:8px;color:var(--text-medium);line-height:1.5;}.footer{background-color:var(--brand-teal);color:white;padding:20px;text-align:center;font-size:16px;font-weight:600;}.html2pdf__page-break{height:1px;page-break-after:always;}</style></head><body><div class="voucher-container"><header class="header"><div class="header-text"><h1>Let's Go Makkah.</h1><h2>${data.hotelName}</h2></div><div class="header-image"><img src="${data.hotelImageUrl}" alt="Hotel Image"></div></header><div class="address-bar"><span>${data.hotelAddress}</span><span>${data.hotelPhone}</span></div><main class="content-area"><section class="booking-details-section"><h3 class="section-title">Booking Details</h3><div class="booking-grid"><div class="info-block"><div class="label">Checkin | Checkout</div><div class="value">${data.checkinDate} - ${data.checkinTime} | ${data.checkoutDate} - ${data.checkoutTime}</div></div><div class="info-block"><div class="label">Room Type</div><div class="value">${data.roomType}</div></div><div class="info-block"><div class="label">Stay</div><div class="value">${data.stayDuration}</div></div><div class="info-block"><div class="label">Board Basis</div><div class="value">${data.boardBasis}</div></div><div class="room-info-block"><div class="label">Room ${data.roomQuantity}</div><div class="value">${data.roomDetails}</div></div></div></section><section class="travelers-section"><h3 class="section-title">Travellers</h3><table class="travelers-table"><thead><tr><th>Traveller</th><th>First Name</th><th>Last Name</th><th>Type</th></tr></thead><tbody>${travelerRows}</tbody></table></section><div class="html2pdf__page-break"></div><section class="instructions-section"><h3 class="section-title">Checkin / Checkout Instructions</h3><p><strong>Checkin time:</strong> ${data.instructions.checkinTimeRange}</p><p><strong>Checkout time:</strong> ${data.instructions.checkoutTimeFixed}</p><ul>${instructionPoints}</ul><p style="margin-top:25px;">${data.instructions.finalNote}</p></section><section class="amenities-section"><h3 class="section-title">Amenities</h3><p style="color:var(--text-medium);">${data.amenities}</p></section></main><footer class="footer">Let's Go Makkah.</footer></div></body></html>`;
}
</script>