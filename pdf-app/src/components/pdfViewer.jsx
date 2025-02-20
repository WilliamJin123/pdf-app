import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
    page: {
        flexDirection: 'row',
        backgroundColor: '#E4E4E4'
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1
    }
});

// Create Document Component
export default function PdfViewer({fileBlob}) {
    const [blobUrl, setBlobUrl] = useState(URL.createObjectURL(fileBlob))
    
    

    return (
        <Document>
            <Page size="A4" style={styles.page} pageNumber={1}>
                <View style={styles.section}>
                    <Text>Section #1</Text>
                </View>
                <View style={styles.section}>
                    <Text>Section #2</Text>
                </View>
            </Page>
        </Document>
    )
}
