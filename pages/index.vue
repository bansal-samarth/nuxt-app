<template>
  <div class="min-h-screen flex items-center justify-center p-8 bg-slate-50">
    <div class="max-w-2xl w-full bg-white p-8 rounded-xl shadow">
      <h1 class="text-xl font-bold mb-4">Generate PDF with pdfme</h1>
      <p class="mb-4 text-sm text-gray-600">Click to generate a PDF voucher using pdfme on the server.</p>

      <textarea v-model="jsonText" rows="8" class="w-full border rounded p-2 mb-4"></textarea>

      <div class="flex gap-2">
        <button @click="generate" :disabled="loading" class="px-4 py-2 bg-teal-600 text-white rounded">
          {{ loading ? 'Generating...' : 'Generate PDF' }}
        </button>
        <button @click="loadSample" class="px-4 py-2 border rounded">Load sample data</button>
      </div>

      <p v-if="error" class="text-red-600 mt-3">{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const loading = ref(false)
const error = ref('')
const sample = {
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
  boardBasis: 'Breakfast, Lunch, Dinner Included',
  travelers: [
    { firstName: 'Abdullah', lastName: 'Syed', type: 'Adult' },
    { firstName: 'Rahamath', lastName: 'Syed', type: 'Adult' },
    { firstName: 'Rabiya Faheem', lastName: 'Syed', type: 'Adult' },
    { firstName: 'Siraj Sohail', lastName: 'Syed', type: 'Adult' },
    { firstName: 'Fatima', lastName: 'Shaikh', type: 'Adult' }
  ],
  instructions: {
    checkinTime: '4:00 PM - 9:00 PM',
    checkoutTime: '2:00 PM',
    points: [
      'Extra-person charges may apply and vary depending on property policy',
      'Government-issued photo identification and a credit card, debit card, or cash deposit may be required at check-in for incidental charges'
    ]
  }
}

const jsonText = ref(JSON.stringify(sample, null, 2))

const loadSample = () => { jsonText.value = JSON.stringify(sample, null, 2) }

const generate = async () => {
  loading.value = true
  error.value = ''
  try {
    const payload = JSON.parse(jsonText.value)

    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    if (!res.ok) {
      const txt = await res.text()
      throw new Error(txt || `HTTP ${res.status}`)
    }

    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `voucher_${payload.confirmationNumber || 'voucher'}.pdf`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  } catch (err: any) {
    console.error(err)
    error.value = err?.message || 'Failed to generate PDF'
  } finally {
    loading.value = false
  }
}
</script>
