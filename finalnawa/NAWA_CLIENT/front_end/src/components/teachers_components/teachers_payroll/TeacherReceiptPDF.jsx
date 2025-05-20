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
  teacherSection: {
    width: '48%',
  },
  salarySection: {
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
  teacherInfo: {
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
  salaryTable: {
    width: '100%',
    marginBottom: 15
  },
  salaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    paddingHorizontal: 2,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6'
  },
  salaryItem: {
    fontSize: 10,
    color: '#4b5563'
  },
  salaryAmount: {
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
  footer: {
    marginTop: 50,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    borderTopStyle: 'solid',
    paddingTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  signatureSection: {
    width: '30%',
    alignItems: 'center'
  },
  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
    borderBottomStyle: 'solid',
    width: '100%',
    marginBottom: 5
  },
  signatureLabel: {
    fontSize: 9,
    color: '#6b7280',
    textAlign: 'center'
  },
  notesSection: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#f9fafb',
    borderRadius: 4,
    borderLeftWidth: 2,
    borderLeftColor: '#d1d5db',
    borderLeftStyle: 'solid'
  },
  notesTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#4b5563',
    marginBottom: 4
  },
  notesContent: {
    fontSize: 8,
    color: '#6b7280'
  }
});

const TeacherReceiptPDF = ({ teacherData, pdfData }) => {
  const receiptNumber = Math.floor(100000 + Math.random() * 900000);
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const paymentDate = pdfData.date 
    ? new Date(pdfData.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }) 
    : currentDate;
  
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
              <Text>SALARY RECEIPT</Text>
            </View>
          </View>
          <View style={styles.headerRightContent}>
            <Image 
              style={styles.schoolLogo} 
              src="/school_logo.png" 
              cache={false}
              quality={100}
            />
          </View>
        </View>

        {/* Receipt Meta Info */}
        <View style={styles.receiptMeta}>
          <View>
            <Text style={styles.receiptNumber}>RECEIPT NUMBER</Text>
            <Text style={styles.receiptNumberValue}>NTST-{receiptNumber}</Text>
          </View>
          <View style={styles.dateSection}>
            <Text style={styles.dateLabel}>ISSUE DATE</Text>
            <Text style={styles.dateValue}>{currentDate}</Text>
          </View>
        </View>

        {/* Content in Two Columns */}
        <View style={styles.contentColumns}>
          {/* Teacher Information */}
          <View style={styles.teacherSection}>
            <Text style={styles.sectionTitle}>Teacher Details</Text>
            <View style={styles.teacherInfo}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>TEACHER NAME</Text>
                <Text style={styles.infoValue}>{teacherData.name || 'N/A'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>TEACHER ID</Text>
                <Text style={styles.infoValue}>{teacherData._id ? teacherData._id.substring(0, 10) + '...' : 'N/A'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>POSITION</Text>
                <Text style={styles.infoValue}>{teacherData.position || 'Teacher'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>CONTACT</Text>
                <Text style={styles.infoValue}>{teacherData.contact || 'N/A'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>EMAIL</Text>
                <Text style={styles.infoValue}>{teacherData.email || 'N/A'}</Text>
              </View>
            </View>
          </View>

          {/* Salary Information */}
          <View style={styles.salarySection}>
            <Text style={styles.sectionTitle}>Payment Details</Text>
            <View style={styles.monthHighlight}>
              <Text>{pdfData.month ? pdfData.month.toUpperCase() : 'CURRENT MONTH'}</Text>
            </View>
            <View style={styles.salaryTable}>
              <View style={styles.salaryRow}>
                <Text style={styles.salaryItem}>Base Salary</Text>
                <Text style={styles.salaryAmount}>RS {pdfData.salary ? pdfData.salary.toFixed(2) : '0.00'}</Text>
              </View>
              
              {pdfData.allowance > 0 && (
                <View style={styles.salaryRow}>
                  <Text style={styles.salaryItem}>Allowance</Text>
                  <Text style={styles.salaryAmount}>RS {pdfData.allowance.toFixed(2)}</Text>
                </View>
              )}
              
              {pdfData.remarks && (
                <View style={styles.salaryRow}>
                  <Text style={styles.salaryItem}>Remarks</Text>
                  <Text style={styles.salaryAmount}>{pdfData.remarks}</Text>
                </View>
              )}
            </View>
            
            <View style={styles.totalSection}>
              <Text style={styles.totalLabel}>TOTAL AMOUNT PAID</Text>
              <Text style={styles.totalAmount}>RS {pdfData.total ? pdfData.total.toFixed(2) : '0.00'}</Text>
            </View>
            
            <View style={{marginTop: 10}}>
              <Text style={styles.infoLabel}>PAYMENT DATE</Text>
              <Text style={styles.infoValue}>{paymentDate}</Text>
            </View>
          </View>
        </View>
        
        {/* Footer with signatures */}
        <View style={styles.footer}>
          <View style={styles.signatureSection}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureLabel}>Accountant</Text>
          </View>
          
          <View style={styles.signatureSection}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureLabel}>Principal</Text>
          </View>
          
          <View style={styles.signatureSection}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureLabel}>Teacher's Signature</Text>
          </View>
        </View>
        
        {/* Notes */}
        <View style={styles.notesSection}>
          <Text style={styles.notesTitle}>Notes:</Text>
          <Text style={styles.notesContent}>
            This is an official salary receipt. Please keep this document for your records.
            If you have any questions regarding this payment, please contact the school's finance department.
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default TeacherReceiptPDF;