import PdfPrinter from 'pdfmake';

const getPDFReadableStream = (plannerData) => {
    const fonts = {
        Roboto: {
          normal: 'Helvetica',
        }
      };
      
      const printer = new PdfPrinter(fonts);
      const plannerName = plannerData.plannerName
      const plannerTasks = plannerData.plannerTasks
      const tasksTableBody = plannerTasks.map(plan => (
          [plan.content, plan.done]
      ))

      const docDefinition = {
        content: [
            {text: `${plannerName} Planner`, style: 'header'},
            {
                table: {
                    body: tasksTableBody
                }
            }
        ],
        styles: {
            header: {
                fontSize: 18,
                margin: [0, 0, 0, 10]
            },
        }
      };
      
      const pdfReadableStream = printer.createPdfKitDocument(docDefinition);
      pdfReadableStream.end();

      return pdfReadableStream
}

export default getPDFReadableStream