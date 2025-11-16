const PDFDocument = require('pdfkit');

class PDFGenerator {
    static generateHeader(doc, title) {
        doc.fontSize(20)
            .fillColor('#2c5f2d')
            .text('SAIM Dairy Farm', 50, 50)
            .fontSize(12)
            .fillColor('#000000')
            .text(title, 50, 75)
            .text(`Generated: ${new Date().toLocaleDateString()}`, 50, 90)
            .moveDown(2);
    }

    static generateFooter(doc) {
        doc.fontSize(10)
            .fillColor('#6c757d')
            .text(`Page ${doc.page}`, 50, doc.page.height - 50, { align: 'center' });
    }

    static generateTable(doc, headers, data, y = 150) {
        const tableTop = y;
        const itemHeight = 25;
        const columnWidth = (doc.page.width - 100) / headers.length;

        // Draw headers
        doc.fontSize(10).fillColor('#2c5f2d');
        headers.forEach((header, i) => {
            doc.text(header, 50 + i * columnWidth, tableTop, {
                width: columnWidth,
                align: 'left'
            });
        });

        // Draw header line
        doc.moveTo(50, tableTop + 15)
            .lineTo(doc.page.width - 50, tableTop + 15)
            .stroke('#2c5f2d');

        // Draw data rows
        doc.fontSize(9).fillColor('#000000');
        data.forEach((row, rowIndex) => {
            const yPos = tableTop + 25 + rowIndex * itemHeight;
            
            // Check if we need a new page
            if (yPos > doc.page.height - 100) {
                doc.addPage();
                return this.generateTable(doc, headers, data.slice(rowIndex), 50);
            }

            row.forEach((cell, colIndex) => {
                doc.text(cell || 'N/A', 50 + colIndex * columnWidth, yPos, {
                    width: columnWidth - 5,
                    align: 'left'
                });
            });

            // Draw row line
            doc.moveTo(50, yPos + 18)
                .lineTo(doc.page.width - 50, yPos + 18)
                .stroke('#e0e0e0');
        });
    }
}

module.exports = PDFGenerator;
