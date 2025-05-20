import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontFamily: 'Helvetica'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    borderBottomStyle: 'solid'
  },
  headerLeftContent: {
    width: '60%'
  },
  headerRightContent: {
    width: '40%',
    alignItems: 'flex-end'
  },
  schoolLogo: {
    width: 100,
    height: 'auto',
    marginBottom: 5,
    objectFit: 'contain'
  },
  schoolName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4
  },
  schoolAddress: {
    fontSize: 9,
    color: '#6b7280',
    marginBottom: 2
  },
  receiptTag: {
    backgroundColor: '#0a66c2',
    color: 'white',
    padding: 6,
    fontSize: 10,
    fontWeight: 'bold',
    borderRadius: 4,
    marginTop: 5,
    alignSelf: 'flex-start'
  },
  receiptTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 5
  },
  receiptSubtitle: {
    fontSize: 10,
    color: '#6b7280',
    marginBottom: 5
  },
  receiptMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    borderBottomStyle: 'solid'
  },
  receiptNumber: {
    fontSize: 10,
    color: '#374151',
    marginBottom: 2
  },
  receiptNumberValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#111827'
  },
  dateSection: {
    textAlign: 'right'
  },
  dateLabel: {
    fontSize: 10,
    color: '#374151',
    marginBottom: 2
  },
  dateValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#111827'
  },
  contentColumns: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25
  },
  studentSection: {
    width: '48%',
  },
  feeSection: {
    width: '48%',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    textTransform: 'uppercase'
  },
  studentInfo: {
    backgroundColor: '#f9fafb',
    padding: 10,
    borderRadius: 4,
    borderLeftWidth: 3,
    borderLeftColor: '#0a66c2',
    borderLeftStyle: 'solid'
  },
  infoRow: {
    marginBottom: 6
  },
  infoLabel: {
    fontSize: 9,
    color: '#6b7280',
    marginBottom: 1
  },
  infoValue: {
    fontSize: 11,
    color: '#111827',
    fontWeight: 'medium'
  },
  monthHighlight: {
    backgroundColor: '#0a66c2',
    color: 'white',
    padding: 6,
    fontSize: 12,
    fontWeight: 'bold',
    borderRadius: 4,
    marginBottom: 10,
    textAlign: 'center'
  },
  feeTable: {
    width: '100%',
    marginBottom: 15
  },
  feeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    paddingHorizontal: 2,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6'
  },
  feeItem: {
    fontSize: 10,
    color: '#4b5563'
  },
  feeAmount: {
    fontSize: 10,
    fontWeight: 'medium',
    color: '#111827',
    textAlign: 'right'
  },
  totalSection: {
    backgroundColor: '#f9fafb',
    padding: 10,
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  totalLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#374151'
  },
  totalAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0a66c2'
  },
  footerSection: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 20
  },
  signature: {
    width: '48%'
  },
  signatureTitle: {
    fontSize: 10,
    color: '#6b7280',
    marginBottom: 20
  },
  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#9ca3af',
    marginBottom: 5
  },
  stampSection: {
    width: '48%',
    alignItems: 'center'
  },
  stampCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center'
  },
  stampText: {
    fontSize: 8,
    color: '#6b7280',
    marginTop: 5,
    textAlign: 'center'
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 30,
    right: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 8,
    color: '#9ca3af',
    paddingTop: 8,
    borderTopWidth: 0.5,
    borderTopColor: '#e5e7eb'
  }
});

const ReceiptPDF = ({ studentData, pdfdata }) => {
  const receiptNumber = Math.floor(100000 + Math.random() * 900000);
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeftContent}>
            <Text style={styles.schoolName}>Nawa Tara English School</Text>
            <Text style={styles.schoolAddress}>Jamungacchi 04, Biratnagar, Morang, Nepal</Text>
            <Text style={styles.schoolAddress}>Phone: +977-1-4500000 • Email: info@navatara.edu.np</Text>
            <View style={styles.receiptTag}>
              <Text>RECEIPT</Text>
            </View>
          </View>
          <View style={styles.headerRightContent}>
            <Image style={styles.logo} src="/school_logo.png" />
          </View>
        </View>

        {/* Receipt Meta Info */}
        <View style={styles.receiptMeta}>
          <View>
            <Text style={styles.receiptNumber}>RECEIPT NUMBER</Text>
            <Text style={styles.receiptNumberValue}>NTSC-{receiptNumber}</Text>
          </View>
          <View style={styles.dateSection}>
            <Text style={styles.dateLabel}>ISSUE DATE</Text>
            <Text style={styles.dateValue}>{currentDate}</Text>
          </View>
        </View>

        {/* Content in Two Columns */}
        <View style={styles.contentColumns}>
          {/* Student Information */}
          <View style={styles.studentSection}>
            <Text style={styles.sectionTitle}>Student Details</Text>
            <View style={styles.studentInfo}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>STUDENT NAME</Text>
                <Text style={styles.infoValue}>{studentData.name}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>CLASS</Text>
                <Text style={styles.infoValue}>{studentData.class_name}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>FATHER'S NAME</Text>
                <Text style={styles.infoValue}>{studentData.father_name}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>MOTHER'S NAME</Text>
                <Text style={styles.infoValue}>{studentData.mother_name}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>ADDRESS</Text>
                <Text style={styles.infoValue}>{studentData.address}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>CONTACT</Text>
                <Text style={styles.infoValue}>{studentData.father_phone || studentData.mother_phone}</Text>
              </View>
            </View>
          </View>

          {/* Fee Information */}
          <View style={styles.feeSection}>
            <Text style={styles.sectionTitle}>Payment Details</Text>
            <View style={styles.monthHighlight}>
              <Text>{pdfdata.month.toUpperCase()}</Text>
            </View>
            <View style={styles.feeTable}>
              {pdfdata.adm_fee > 0 && (
                <View style={styles.feeRow}>
                  <Text style={styles.feeItem}>Admission Fee</Text>
                  <Text style={styles.feeAmount}>RS {pdfdata.adm_fee.toFixed(2)}</Text>
                </View>
              )}
              
              {pdfdata.month_fee > 0 && (
                <View style={styles.feeRow}>
                  <Text style={styles.feeItem}>Monthly Tuition Fee</Text>
                  <Text style={styles.feeAmount}>RS {pdfdata.month_fee.toFixed(2)}</Text>
                </View>
              )}
              
              {pdfdata.comp_fee > 0 && (
                <View style={styles.feeRow}>
                  <Text style={styles.feeItem}>Computer Lab Charges</Text>
                  <Text style={styles.feeAmount}>RS {pdfdata.comp_fee.toFixed(2)}</Text>
                </View>
              )}
            </View>
            
            <View style={styles.totalSection}>
              <Text style={styles.totalLabel}>TOTAL AMOUNT PAID</Text>
              <Text style={styles.totalAmount}>RS {pdfdata.total.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Footer with Signature and Stamp - Simplified to two columns */}
        <View style={styles.footerSection}>
          {/* Signature */}
          <View style={styles.signature}>
            <Text style={styles.signatureTitle}>AUTHORIZED SIGNATURE</Text>
            <View style={styles.signatureLine}></View>
            {/* Principal text removed as requested */}
          </View>
          
          {/* School Stamp - Kept as requested */}
          <View style={styles.stampSection}>
            <View style={styles.stampCircle}>
              <Text style={{ fontSize: 8, color: '#9ca3af' }}>SCHOOL STAMP</Text>
            </View>
            <Text style={styles.stampText}>Official School Seal</Text>
          </View>
        </View>

        {/* Page Footer */}
        <View style={styles.footer} fixed>
          <Text>Navatara English School</Text>
          <Text>NTSC-{receiptNumber} • {currentDate}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default ReceiptPDF;