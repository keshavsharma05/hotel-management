const cron = require('node-cron');
const Booking = require('./models/Booking');

// Run every minute for demonstration purposes (in production, every hour is fine)
cron.schedule('* * * * *', async () => {
  try {
    const now = new Date();
    // Find bookings that are Checked In but their QR has expired
    const expiredBookings = await Booking.find({
      status: 'Checked In',
      qrExpiry: { $lt: now }
    });

    if (expiredBookings.length > 0) {
      console.log(`[Cron] Found ${expiredBookings.length} bookings to check out automatically.`);
      for (const booking of expiredBookings) {
        booking.status = 'Checked Out';
        await booking.save();
      }
      console.log('[Cron] Check out process completed.');
    }
  } catch (err) {
    console.error('[Cron] Error running automatic checkout task:', err);
  }
});
