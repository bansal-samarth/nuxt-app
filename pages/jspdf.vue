<template>
  <div class="bg-gradient-to-br from-slate-50 to-slate-100 font-sans min-h-screen py-12 flex flex-col items-center justify-center">
    <!-- Loading Overlay -->
    <div 
      v-if="isLoading" 
      class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm"
    >
      <div class="text-white text-xl font-semibold p-8 bg-slate-800 bg-opacity-90 rounded-xl shadow-2xl border border-slate-600">
        <div class="flex items-center space-x-3">
          <div class="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
          <span>Generating Professional PDF Voucher...</span>
        </div>
      </div>
    </div>

    <!-- Main Content Card -->
    <div class="max-w-4xl w-full mx-auto px-6">
      <div class="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <!-- Header Section -->
        <div class="bg-gradient-to-r from-teal-600 to-teal-700 px-8 py-6">
          <h1 class="text-3xl font-bold text-white mb-2">Professional Booking Voucher Generator</h1>
          <p class="text-teal-100 text-lg">Generate beautiful, print-ready PDF vouchers matching your exact design</p>
        </div>

        <!-- Content Section -->
        <div class="p-8">
          <!-- Features Grid -->
          <div class="grid md:grid-cols-2 gap-6 mb-8">
            <div class="bg-slate-50 rounded-lg p-6 border border-slate-200">
              <div class="flex items-center mb-3">
                <div class="w-3 h-3 bg-teal-500 rounded-full mr-3"></div>
                <h3 class="font-semibold text-slate-800">Exact Design Match</h3>
              </div>
              <p class="text-slate-600 text-sm">Perfect replica of your teal-colored PDF with hotel image, proper table styling, and professional layout.</p>
            </div>
            <div class="bg-slate-50 rounded-lg p-6 border border-slate-200">
              <div class="flex items-center mb-3">
                <div class="w-3 h-3 bg-teal-500 rounded-full mr-3"></div>
                <h3 class="font-semibold text-slate-800">Smart Page Handling</h3>
              </div>
              <p class="text-slate-600 text-sm">Intelligent content distribution prevents awkward page breaks and ensures professional layout across pages.</p>
            </div>
            <div class="bg-slate-50 rounded-lg p-6 border border-slate-200">
              <div class="flex items-center mb-3">
                <div class="w-3 h-3 bg-teal-500 rounded-full mr-3"></div>
                <h3 class="font-semibold text-slate-800">Professional Tables</h3>
              </div>
              <p class="text-slate-600 text-sm">Clean traveler tables with proper headers, alternating row colors, and consistent formatting.</p>
            </div>
            <div class="bg-slate-50 rounded-lg p-6 border border-slate-200">
              <div class="flex items-center mb-3">
                <div class="w-3 h-3 bg-teal-500 rounded-full mr-3"></div>
                <h3 class="font-semibold text-slate-800">Complete Instructions</h3>
              </div>
              <p class="text-slate-600 text-sm">Full check-in/checkout instructions with amenities section and proper bullet formatting.</p>
            </div>
          </div>

          <!-- Sample Selection -->
          <div class="mb-8">
            <h3 class="text-lg font-semibold text-slate-800 mb-4">Choose Sample Type</h3>
            <div class="flex flex-wrap gap-3">
              <button 
                @click="currentSample = 'single'"
                :class="currentSample === 'single' ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'"
                class="px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Single Room (Exact PDF Match)
              </button>
              <button 
                @click="currentSample = 'multi'"
                :class="currentSample === 'multi' ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'"
                class="px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Multi-Room Booking
              </button>
            </div>
          </div>

          <!-- Action Button -->
          <button 
            @click="handleDownloadPdf" 
            :disabled="isLoading"
            class="w-full bg-gradient-to-r from-teal-600 to-teal-700 text-white font-semibold py-4 px-8 text-lg rounded-xl shadow-lg hover:from-teal-700 hover:to-teal-800 focus:outline-none focus:ring-4 focus:ring-teal-500/30 transition-all transform hover:scale-[1.02] disabled:bg-slate-400 disabled:cursor-not-allowed disabled:transform-none"
          >
            {{ isLoading ? 'Generating PDF...' : 'Generate Professional Voucher PDF' }}
          </button>

          <!-- Info Text -->
          <p class="text-center text-slate-500 text-sm mt-4">
            Generated PDF will exactly match your teal design with hotel image, professional tables, and complete instructions.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const isLoading = ref(false);
const currentSample = ref('single');

// helper: convert external image URL to dataURL (base64)
const fetchImageAsDataUrl = async (url) => {
  try {
    const res = await fetch(url, { mode: 'cors' });
    if (!res.ok) throw new Error('Image fetch failed: ' + res.status);
    const blob = await res.blob();
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('Failed to read blob as dataURL'));
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  } catch (err) {
    console.warn('Could not fetch image for PDF header:', err);
    return null;
  }
};

const HOTEL_IMAGE_URL = 'https://cdn.worldota.net/t/1024x768/extranet/b5/d3/b5d3d33394494c68321246882c1bd93a6832dcd5.jpeg';

const handleDownloadPdf = async () => {
  isLoading.value = true;
  try {
    // load image (may return null on failure)
    const hotelImageDataUrl = await fetchImageAsDataUrl(HOTEL_IMAGE_URL);

    const { jsPDF } = await import('jspdf');
    await new Promise(resolve => setTimeout(resolve, 50)); // small UX pause

    const bookingData = currentSample.value === 'single' ? getSingleRoomBookingData() : getMultiRoomBookingData();
    const doc = new jsPDF('p', 'mm', 'a4');
    const PAGE_WIDTH = doc.internal.pageSize.getWidth();
    const PAGE_HEIGHT = doc.internal.pageSize.getHeight();
    const LEFT_MARGIN = 18;
    const RIGHT_MARGIN = 18;
    const TOP_MARGIN = 18;
    const BOTTOM_MARGIN = 16;
    const CONTENT_WIDTH = PAGE_WIDTH - LEFT_MARGIN - RIGHT_MARGIN;

    // Colors
    const TEAL_PRIMARY = '#149E94'; // slightly adjusted for print
    const TEAL_DARK = '#0F766E';
    const WHITE = '#FFFFFF';
    const DARK_TEXT = '#1F2937';
    const MEDIUM_TEXT = '#4B5563';
    const BORDER_COLOR = '#E5E7EB';
    const TABLE_ROW_ALT = '#F8FFFE';
    const PURPLE_LINE = '#E9D5FF';

    // Table metrics
    const TABLE_HEADER_HEIGHT = 10;
    const TABLE_ROW_HEIGHT = 10;
    const TABLE_COL_WIDTHS = [40, 60, 60, 30]; // travellers, first, last, type (adjust to CONTENT_WIDTH)
    // scale last width to CONTENT_WIDTH if needed
    const totalCol = TABLE_COL_WIDTHS.reduce((a,b) => a+b, 0);
    if (totalCol !== CONTENT_WIDTH) {
      const scale = CONTENT_WIDTH / totalCol;
      for (let i=0;i<TABLE_COL_WIDTHS.length;i++) TABLE_COL_WIDTHS[i] = TABLE_COL_WIDTHS[i] * scale;
    }

    let y = TOP_MARGIN;
    let currentPage = 1;

    // Utility: check page break, add page and optionally call onNewPage callback
    const checkPageBreak = (requiredHeight, onNewPage = null) => {
      if (y + requiredHeight > PAGE_HEIGHT - BOTTOM_MARGIN) {
        doc.addPage();
        currentPage++;
        y = TOP_MARGIN;
        if (typeof onNewPage === 'function') onNewPage();
        return true;
      }
      return false;
    };

    // Draw main hero header (only on first page)
    const drawHeroHeader = () => {
      // big teal rectangle at top
      doc.setFillColor(TEAL_PRIMARY);
      doc.rect(LEFT_MARGIN - 5, y - 6, PAGE_WIDTH - (LEFT_MARGIN - 5) - RIGHT_MARGIN + 5, 42, 'F');

      // Branding left
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.setTextColor(WHITE);
      doc.text("Lets Go", LEFT_MARGIN + 2, y + 6);
      doc.text("Makkah.", LEFT_MARGIN + 2, y + 16);

      // Hotel name
      doc.setFontSize(18);
      doc.text(bookingData.hotelName, LEFT_MARGIN + 2, y + 32);

      // Hotel image (if available) on right; otherwise draw white placeholder
      const imgX = PAGE_WIDTH - RIGHT_MARGIN - 36;
      const imgY = y + 2;
      const imgW = 36;
      const imgH = 36;

      if (hotelImageDataUrl) {
        try {
          // jsPDF expects jpg/png/svg data URL; FileReader produced the correct dataURL
          // detect MIME type for addImage 'format' param (optional). jsPDF can handle dataURL directly w/o format.
          doc.addImage(hotelImageDataUrl, imgX, imgY, imgW, imgH);
        } catch (err) {
          // fallback to white rectangle if addImage fails
          doc.setFillColor(WHITE);
          doc.rect(imgX, imgY, imgW, imgH, 'F');
          doc.setDrawColor(BORDER_COLOR);
          doc.setLineWidth(0.5);
          doc.rect(imgX, imgY, imgW, imgH);
        }
      } else {
        doc.setFillColor(WHITE);
        doc.rect(imgX, imgY, imgW, imgH, 'F');
        doc.setDrawColor(BORDER_COLOR);
        doc.setLineWidth(0.5);
        doc.rect(imgX, imgY, imgW, imgH);
      }

      y += 50;
    };

    // Draw contact bar
    const drawContactBar = () => {
      doc.setFillColor(TEAL_DARK);
      doc.rect(LEFT_MARGIN - 5, y - 6, PAGE_WIDTH - (LEFT_MARGIN - 5) - RIGHT_MARGIN + 5, 10, 'F');

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(WHITE);
      doc.text(bookingData.hotelAddress, LEFT_MARGIN + 2, y);
      doc.text(bookingData.hotelPhone, PAGE_WIDTH - RIGHT_MARGIN - 2, y, { align: 'right' });

      y += 14;

      // purple line
      doc.setDrawColor(PURPLE_LINE);
      doc.setLineWidth(1);
      doc.line(LEFT_MARGIN, y - 4, PAGE_WIDTH - RIGHT_MARGIN, y - 4);
      y += 6;
    };

    // Draw a section heading
    const drawSectionHeading = (title) => {
      checkPageBreak(20);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.setTextColor(DARK_TEXT);
      doc.text(title, LEFT_MARGIN, y);
      y += 12;
    };

    // Two-column booking details (left aligned column widths)
    const drawBookingDetails = () => {
      drawSectionHeading('Booking Details');

      const leftColX = LEFT_MARGIN;
      const midColX = LEFT_MARGIN + 70;
      const rightColX = LEFT_MARGIN + 130;

      // small labels
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(MEDIUM_TEXT);
      // row - Checkin / Checkout / Room Type
      checkPageBreak(40);
      doc.text('Checkin', leftColX, y);
      doc.text('|', leftColX + 42, y);
      doc.text('Checkout', leftColX + 52, y);
      doc.text('Room Type', rightColX, y);

      y += 8;

      // dates
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(DARK_TEXT);
      doc.text(bookingData.checkinDate, leftColX, y);
      doc.text(bookingData.checkoutDate, leftColX + 52, y);
      doc.text(bookingData.roomType || bookingData.roomTypeSimple || '', rightColX, y);

      y += 8;

      // times & board basis
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(MEDIUM_TEXT);
      doc.text(bookingData.checkinTime, leftColX, y);
      doc.text(bookingData.checkoutTime, leftColX + 52, y);
      doc.text('Board Basis', rightColX, y);

      y += 8;

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(DARK_TEXT);
      doc.text(bookingData.boardBasis || bookingData.boardBasisShort || '', rightColX, y);

      y += 12;

      doc.setTextColor(MEDIUM_TEXT);
      doc.setFont('helvetica', 'normal');
      doc.text('Stay', leftColX, y);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(DARK_TEXT);
      doc.text(bookingData.stayDuration, leftColX, y + 8);

      y += 18;

      // separator
      doc.setDrawColor(PURPLE_LINE);
      doc.setLineWidth(1);
      doc.line(LEFT_MARGIN, y - 4, PAGE_WIDTH - RIGHT_MARGIN, y - 4);
      y += 10;

      // Room quantity
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(MEDIUM_TEXT);
      doc.text('Room Quantity', LEFT_MARGIN, y);
      y += 6;
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(DARK_TEXT);
      doc.text(bookingData.roomQuantity || (bookingData.rooms && `${bookingData.rooms.length} ROOM(S)`) || '1 ROOM(S)', LEFT_MARGIN, y);
      y += 14;
    };

    // Table header draw (separate because we re-draw after page breaks)
    const drawTableHeader = (xStart = LEFT_MARGIN) => {
      // teal header rectangle
      doc.setFillColor(TEAL_PRIMARY);
      doc.rect(xStart, y - 3, CONTENT_WIDTH, TABLE_HEADER_HEIGHT + 2, 'F');

      // header text
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(WHITE);
      let tx = xStart + 2;
      const headers = ['Travellers', 'First Name', 'Last Name', 'Type'];
      for (let i = 0; i < headers.length; i++) {
        doc.text(headers[i], tx, y + 4);
        tx += TABLE_COL_WIDTHS[i];
      }
      y += TABLE_HEADER_HEIGHT + 4;
    };

    // Draw travelers table (handles page breaks and repeats header)
    const drawTravelersTable = (travelers) => {
      if (!travelers || travelers.length === 0) return;
      // ensure enough space for first header
      checkPageBreak(TABLE_HEADER_HEIGHT + 10 + (Math.min(3, travelers.length) * TABLE_ROW_HEIGHT), () => {
        // if new page created before header, we still want to show header at top of new page
      });

      drawTableHeader();

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(DARK_TEXT);

      for (let i = 0; i < travelers.length; i++) {
        // before each row, check page break
        if (y + TABLE_ROW_HEIGHT > PAGE_HEIGHT - BOTTOM_MARGIN) {
          doc.addPage();
          currentPage++;
          y = TOP_MARGIN;
          // small top padding
          y += 6;
          // re-draw a small purple line so pages feel connected to header style
          doc.setDrawColor(PURPLE_LINE);
          doc.setLineWidth(1);
          doc.line(LEFT_MARGIN, y - 4, PAGE_WIDTH - RIGHT_MARGIN, y - 4);
          y += 6;
          drawTableHeader();
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9);
          doc.setTextColor(DARK_TEXT);
        }

        // alternating row background
        if (i % 2 === 1) {
          doc.setFillColor(TABLE_ROW_ALT);
          doc.rect(LEFT_MARGIN, y - 2, CONTENT_WIDTH, TABLE_ROW_HEIGHT, 'F');
        }

        let tx = LEFT_MARGIN + 2;
        const row = [
          `Traveller ${travelers[i].travelerNumber || i + 1}`,
          travelers[i].firstName || '',
          travelers[i].lastName || '',
          travelers[i].type || ''
        ];

        for (let c = 0; c < row.length; c++) {
          doc.text(String(row[c]), tx, y + 4);
          tx += TABLE_COL_WIDTHS[c];
        }

        y += TABLE_ROW_HEIGHT;
      }

      // draw table border outline (approximate)
      doc.setDrawColor(BORDER_COLOR);
      doc.setLineWidth(0.4);
      const tableHeight = (travelers.length * TABLE_ROW_HEIGHT) + TABLE_HEADER_HEIGHT + 6;
      // We can't easily compute exact top of table if it spanned pages; skip global border to avoid wrong lines.
      y += 8;
    };

    // Draw room details (handles both single and multi)
    const drawRoomDetails = () => {
      if (bookingData.rooms && Array.isArray(bookingData.rooms)) {
        bookingData.rooms.forEach((room, idx) => {
          checkPageBreak(30);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(12);
          doc.setTextColor(DARK_TEXT);
          doc.text(`Room ${idx + 1} - ${room.type}`, LEFT_MARGIN, y);
          y += 8;

          doc.setFont('helvetica', 'normal');
          doc.setFontSize(10);
          doc.setTextColor(TEAL_PRIMARY);
          const travellersCount = (room.travelers && room.travelers.length) || 0;
          doc.text(`${travellersCount} ${travellersCount === 1 ? 'Adult' : 'Adults'}, ${bookingData.boardBasis}`, LEFT_MARGIN, y);
          y += 10;

          // travelers table for this room
          drawTravelersTable(room.travelers);
        });
      } else {
        // single room
        checkPageBreak(30);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.setTextColor(DARK_TEXT);
        doc.text(`Room 1 - ${bookingData.roomTypeSimple || bookingData.roomType}`, LEFT_MARGIN, y);
        y += 8;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(TEAL_PRIMARY);
        doc.text(`${(bookingData.travelers || []).length} Adults, ${bookingData.boardBasisShort}`, LEFT_MARGIN, y);
        y += 10;

        drawTravelersTable(bookingData.travelers);
      }
    };

    // Draw instructions with bullets, wrapping and page breaking
    const drawInstructions = () => {
      // rough estimate of space required, but we check before each bullet too
      drawSectionHeading('Checkin / Checkout Instructions');

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(DARK_TEXT);
      doc.text(`Checkin time: ${bookingData.instructions.checkinTime}`, LEFT_MARGIN, y);
      y += 7;
      doc.text(`Checkout time: ${bookingData.instructions.checkoutTime}`, LEFT_MARGIN, y);
      y += 10;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      bookingData.instructions.points.forEach(point => {
        // break bullet if needed
        const lines = doc.splitTextToSize(point, CONTENT_WIDTH - 12);
        const required = (lines.length * 4) + 8;
        if (y + required > PAGE_HEIGHT - BOTTOM_MARGIN) {
          doc.addPage();
          currentPage++;
          y = TOP_MARGIN;
        }
        // bullet
        doc.circle(LEFT_MARGIN + 2, y - 1.5, 0.8, 'F');
        doc.text(lines, LEFT_MARGIN + 8, y);
        y += lines.length * 4 + 6;
      });

      // special note
      if (bookingData.instructions.specialNote) {
        if (y + 16 > PAGE_HEIGHT - BOTTOM_MARGIN) { doc.addPage(); currentPage++; y = TOP_MARGIN; }
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(9);
        doc.text(bookingData.instructions.specialNote, LEFT_MARGIN, y);
        doc.setFont('helvetica', 'normal');
        y += 12;
      }

      // amenities
      if (bookingData.instructions.amenities) {
        if (y + 20 > PAGE_HEIGHT - BOTTOM_MARGIN) { doc.addPage(); currentPage++; y = TOP_MARGIN; }
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.text('Amenities', LEFT_MARGIN, y);
        y += 8;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        const amenLines = doc.splitTextToSize(bookingData.instructions.amenities, CONTENT_WIDTH);
        doc.text(amenLines, LEFT_MARGIN, y);
        y += amenLines.length * 4 + 8;
      }
    };

    // Footer renderer (draw on every page)
    const drawFooterOnPage = (pageNum, total) => {
      doc.setPage(pageNum);
      const footerY = PAGE_HEIGHT - 12;
      doc.setFillColor(TEAL_PRIMARY);
      doc.rect(0, footerY - 5, PAGE_WIDTH, 15, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(WHITE);
      doc.text("Lets Go Makkah.", PAGE_WIDTH / 2, footerY + 2, { align: 'center' });

      // also print page number on right
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.text(`Page ${pageNum} of ${total}`, PAGE_WIDTH - RIGHT_MARGIN, footerY + 2, { align: 'right' });
    };

    // --- Generate PDF content in proper order ---
    drawHeroHeader();
    drawContactBar();
    drawBookingDetails();
    drawRoomDetails();
    drawInstructions();

    // Add footer to all pages (must compute after generation)
    const totalPages = doc.internal.getNumberOfPages();
    for (let p = 1; p <= totalPages; p++) {
      drawFooterOnPage(p, totalPages);
    }

    // Save PDF
    const fileName = `BookingVoucher_${bookingData.confirmationNumber}_${new Date().toISOString().slice(0, 10)}.pdf`;
    doc.save(fileName);

  } catch (err) {
    console.error('PDF generation error', err);
    alert('Error generating PDF. See console.');
  } finally {
    isLoading.value = false;
  }
};

// --- Sample data (unchanged) ---
const getSingleRoomBookingData = () => ({
  hotelName: 'DIYAR AL NAKHEEL',
  hotelAddress: 'As Salam Rd, Al Naqa, Madinah 42311, Saudi Arabia',
  hotelPhone: '+966 148192450',
  confirmationNumber: 'LGM-84B9C2',
  checkinDate: '16/04/2025',
  checkoutDate: '19/04/2025',
  checkinTime: '4:00pm',
  checkoutTime: '2:00pm',
  stayDuration: '3 Night(s)',
  roomType: 'QUINTUPLE ROOM - 1 ROOM',
  roomTypeSimple: 'Quintuple Room',
  boardBasis: 'Breakfast, Lunch, Dinner Included',
  boardBasisShort: 'Breakfast, Lunch, Dinner Included',
  roomQuantity: '1 ROOM(S)',
  travelers: [
    { travelerNumber: 1, firstName: 'Abdullah', lastName: 'Syed', type: 'Adult' },
    { travelerNumber: 2, firstName: 'Rahamath', lastName: 'Syed', type: 'Adult' },
    { travelerNumber: 3, firstName: 'Rabiya Faheem', lastName: 'Syed', type: 'Adult' },
    { travelerNumber: 4, firstName: 'Siraj Sohail', lastName: 'Syed', type: 'Adult' },
    { travelerNumber: 5, firstName: 'Fatima', lastName: 'Shaikh', type: 'Adult' }
  ],
  instructions: {
    checkinTime: '4:00 PM - 9:00 PM',
    checkoutTime: '2:00 PM',
    points: [
      'Extra-person charges may apply and vary depending on property policy',
      'Government-issued photo identification and a credit card, debit card, or cash deposit may be required at check-in for incidental charges',
      'Special requests are subject to availability upon check-in and may incur additional charges; special requests cannot be guaranteed',
      'The name on the credit card used at check-in to pay for incidentals must be the primary name on the guestroom reservation',
      'This property accepts credit cards, mobile payments, and cash',
      'Mobile payment options include: Apple Pay, Huawei Pay, and Samsung Pay',
      'This property reserves the right to pre-authorize the guest\'s credit card prior to arrival.',
      'Cashless transactions are available',
      'Please note that cultural norms and guest policies may differ by country and by property; the policies listed are provided by the property'
    ],
    specialNote: 'This property doesn\'t offer after-hours check-in. Front desk staff will greet guests on arrival.',
    amenities: 'Features at this hotel include complimentary wireless internet access and concierge services'
  }
});

const getMultiRoomBookingData = () => ({
  hotelName: 'GRAND MADINAH PALACE',
  hotelAddress: 'King Faisal Rd, Al Haram, Madinah 42311, Saudi Arabia',
  hotelPhone: '+966 148567890',
  confirmationNumber: 'LGM-MR789X',
  checkinDate: '20/05/2025',
  checkoutDate: '25/05/2025',
  checkinTime: '3:00pm',
  checkoutTime: '12:00pm',
  stayDuration: '5 Night(s)',
  boardBasis: 'Full Board (Breakfast, Lunch, Dinner)',
  rooms: [
    {
      type: 'Deluxe Double Room',
      travelers: [
        { firstName: 'Ahmed', lastName: 'Ali', type: 'Adult' },
        { firstName: 'Fatima', lastName: 'Ali', type: 'Adult' }
      ]
    },
    {
      type: 'Family Suite',
      travelers: [
        { firstName: 'Mohammad', lastName: 'Hassan', type: 'Adult' },
        { firstName: 'Aisha', lastName: 'Hassan', type: 'Adult' },
        { firstName: 'Omar', lastName: 'Hassan', type: 'Child' },
        { firstName: 'Maryam', lastName: 'Hassan', type: 'Child' }
      ]
    }
  ],
  instructions: {
    checkinTime: '3:00 PM - 11:00 PM',
    checkoutTime: '12:00 PM',
    points: [
      'All rooms are confirmed and guaranteed for the specified dates',
      'Children under 6 years stay free when sharing existing bedding',
      'Extra bed charges apply for additional occupants beyond standard room capacity',
      'Government-issued photo identification required for all adult guests',
      'Credit card authorization required at check-in for incidental charges',
      'Special requests are subject to availability and may incur additional charges'
    ],
    specialNote: 'For group bookings, please ensure all travelers arrive together.',
    amenities: 'Features include complimentary Wi-Fi, 24/7 concierge, prayer facilities, and Qibla direction in all rooms'
  }
});
</script>
