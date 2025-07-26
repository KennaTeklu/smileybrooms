function doPost(e) {
  const sheetName = "Checkout Data";
  const errorLogSheetName = "Error Log";
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = ss.getSheetByName(sheetName) || ss.insertSheet(sheetName);

    // Define headers for the main data sheet
    const headers = [
      "Timestamp",
      "Order ID",
      "Order Status",
      "Customer First Name",
      "Customer Last Name",
      "Customer Email",
      "Customer Phone",
      "Customer Notes",
      "Address Line 1",
      "Address Line 2",
      "Address City",
      "Address State",
      "Address ZIP Code",
      "Service Type",
      "Service Frequency",
      "Booking Date",
      "Booking Time",
      "Service Special Instructions",
      "Room Details", // Formatted string of rooms and customizations
      "Purchased Add-ons", // Formatted string of add-ons
      "Subtotal",
      "Discount Amount",
      "Tax Amount",
      "Total Amount",
      "Payment Method",
      "Payment Status",
      "Transaction ID",
      "Device Type",
      "Browser",
      "IP Address",
      "User Agent",
      "Video Recording Consent",
      "Video Consent Details",
      "UTM Source",
      "UTM Medium",
      "UTM Campaign",
      "Referrer URL",
      "Session ID",
      "Cart ID",
      "Coupon Code Applied",
      "Customer Segment",
      "Internal Notes"
    ];

    // Ensure headers are present
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(headers);
      sheet.setFrozenRows(1); // Freeze the header row
      // Optional: Apply basic formatting to headers
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setBackground("#f3f4f6").setFontWeight("bold");
    }

    // Extract data with defaults
    const timestamp = new Date();
    const orderId = data.orderId || "";
    const orderStatus = data.orderStatus || "Unknown";

    const customer = data.customer || {};
    const customerFirstName = customer.firstName || "";
    const customerLastName = customer.lastName || "";
    const customerEmail = customer.email || "";
    const customerPhone = customer.phone || "";
    const customerNotes = customer.notes || "";

    const address = data.address || {};
    const addressLine1 = address.street || "";
    const addressLine2 = address.apartment || "";
    const addressCity = address.city || "";
    const addressState = address.state || "";
    const addressZipCode = address.zipCode || "";

    const serviceDetails = data.serviceDetails || {};
    const serviceType = serviceDetails.type || "";
    const serviceFrequency = serviceDetails.frequency || "";
    const bookingDate = serviceDetails.date || "";
    const bookingTime = serviceDetails.time || "";
    const serviceSpecialInstructions = serviceDetails.specialInstructions || "";

    const cart = data.cart || {};
    const rooms = cart.rooms || [];
    const addons = cart.addons || [];

    // Format room details
    const roomDetails = rooms.map(room => {
      const customizations = room.customizations && room.customizations.length > 0
        ? ` [${room.customizations.join(", ")}]`
        : "";
      return `${room.category}: ${room.count}${customizations}`;
    }).join("; ");

    // Format add-ons
    const purchasedAddons = addons.map(addon => `${addon.name} (x${addon.quantity})`).join("; ");

    const pricing = data.pricing || {};
    const subtotal = pricing.subtotal || 0;
    const discountAmount = pricing.discountAmount || 0;
    const taxAmount = pricing.taxAmount || 0;
    const totalAmount = pricing.totalAmount || 0;

    const payment = data.payment || {};
    const paymentMethod = payment.method || "";
    const paymentStatus = payment.status || "";
    const transactionId = payment.transactionId || "";

    const metadata = data.metadata || {};
    const deviceType = metadata.deviceType || "";
    const browser = metadata.browser || "";
    const ipAddress = metadata.ipAddress || "";
    const userAgent = metadata.userAgent || "";
    const allowVideoRecording = metadata.allowVideoRecording ? "Yes" : "No";
    const videoConsentDetails = metadata.videoConsentDetails || "";
    const utmSource = metadata.utmSource || "";
    const utmMedium = metadata.utmMedium || "";
    const utmCampaign = metadata.utmCampaign || "";
    const referrerUrl = metadata.referrerUrl || "";
    const sessionId = metadata.sessionId || "";
    const cartId = metadata.cartId || "";
    const couponCodeApplied = metadata.couponCodeApplied || "";
    const customerSegment = metadata.customerSegment || "";
    const internalNotes = metadata.internalNotes || "";

    // Create the row to append
    const rowData = [
      timestamp,
      orderId,
      orderStatus,
      customerFirstName,
      customerLastName,
      customerEmail,
      customerPhone,
      customerNotes,
      addressLine1,
      addressLine2,
      addressCity,
      addressState,
      addressZipCode,
      serviceType,
      serviceFrequency,
      bookingDate,
      bookingTime,
      serviceSpecialInstructions,
      roomDetails,
      purchasedAddons,
      subtotal,
      discountAmount,
      taxAmount,
      totalAmount,
      paymentMethod,
      paymentStatus,
      transactionId,
      deviceType,
      browser,
      ipAddress,
      userAgent,
      allowVideoRecording,
      videoConsentDetails,
      utmSource,
      utmMedium,
      utmCampaign,
      referrerUrl,
      sessionId,
      cartId,
      couponCodeApplied,
      customerSegment,
      internalNotes
    ];

    sheet.appendRow(rowData);

    // Optional: Auto-resize columns for better readability
    sheet.autoResizeColumns(1, headers.length);

    return ContentService.createTextOutput(JSON.stringify({ success: true, message: "Data logged successfully." }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (e) {
    const errorLogSheet = ss.getSheetByName(errorLogSheetName) || ss.insertSheet(errorLogSheetName);
    if (errorLogSheet.getLastRow() === 0) {
      errorLogSheet.appendRow(["Timestamp", "Error Message", "Request Payload"]);
      errorLogSheet.setFrozenRows(1);
      const headerRange = errorLogSheet.getRange(1, 1, 1, 3);
      headerRange.setBackground("#f8d7da").setFontWeight("bold"); // Light red background for error headers
    }
    errorLogSheet.appendRow([new Date(), e.message, e.postData ? e.postData.contents : "No payload"]);
    errorLogSheet.autoResizeColumns(1, 3);

    return ContentService.createTextOutput(JSON.stringify({ success: false, error: e.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
