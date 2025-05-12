import { Document, Page} from 'react-pdf'
import {useState, useEffect} from 'react'
// import * as pdfjs from 'pdfjs-dist'
// Create styles




// Create Document Component
export default function PdfViewer({file}) {
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [pdfData, setPdfData] = useState(null);
    useEffect(() => {
        if (file && file instanceof ArrayBuffer) {
          // Convert ArrayBuffer to Uint8Array
          const uint8Array = new Uint8Array(file);
          
          // Create a Blob from the Uint8Array
          const blob = new Blob([uint8Array], { type: 'application/pdf' });
          
          // Create a data URL or use the blob directly
          setPdfData(blob);
          
          console.log('ArrayBuffer converted to Blob for PDF rendering');
        } else {
          // If it's already a URL, File, or Blob, use it directly
          setPdfData(file);
        }
      }, [file]);
    function onDocumentLoadSuccess({ numPages }) {
      setNumPages(numPages);
      setIsLoading(false);
      console.log("PDF loaded successfully with", numPages, "pages");
    }
  
    function onDocumentLoadError(error) {
      console.error("Failed to load PDF:", error);
      setIsLoading(false);
    }
    

    return (
        <div className="pdf-viewer">
        <Document 
          file={pdfData}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={<div>Loading PDF document...</div>}
          error={<div>Error: Could not load PDF. Please check the file path.</div>}
        >
          {isLoading ? (
            <div>Loading page content...</div>
          ) : (
            <Page 
              pageNumber={pageNumber} 
              loading={<div>Rendering page...</div>}
              error={<div>Error rendering page</div>}
            />
          )}
        </Document>
      </div>
    );
  }
