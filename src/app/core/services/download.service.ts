import { Injectable } from "@angular/core";
import * as FileSaver from "file-saver";
import * as PptxGenJS from "pptxgenjs-angular";
import * as XLSX from "xlsx";
import { HttpBackend, HttpClient, HttpResponse } from "@angular/common/http";

import { sa } from "@angular/core/src/render3";
import { DatePipe } from "@angular/common";
import html2canvas from "html2canvas";

declare const require: any;
const jsPDF = require("jspdf");
require("jspdf-autotable");
const EXCEL_EXTENSION = ".xlsx";
const EXCEL_TYPE =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
@Injectable({
  providedIn: "root",
})
export class DownloadService {
  constructor(private httpClient: HttpClient) { }

  public exportAsExcelFile(fileName, testCasesToExport, testcase = true, withoutTestSteps = false) {
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    if (testcase) {
      var worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
        this.parseTestCase(testCasesToExport, withoutTestSteps)
      );
    } else {
      var worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
        this.parseTestReports(testCasesToExport, withoutTestSteps)
      );
    }

    XLSX.utils.book_append_sheet(workbook, worksheet, "Test Cases");
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    this.saveAsExcelFile(excelBuffer, fileName);
  }

  public convertToPdf(fileName, testCasesToExport) {
    this.printAsPdf(fileName, testCasesToExport, true)
  }

  getInnerText(html) {
    // Create a new div element
    var temporalDivElement = document.createElement("div");
    // Set the HTML content with the providen

    temporalDivElement.innerHTML = html;
    // Replace html tags with line breaker
    temporalDivElement.innerHTML = temporalDivElement.innerHTML
      .replace(/ {8,}/g, " ")
      .replace(/\s\s/g, " ");
    temporalDivElement.innerHTML = temporalDivElement.innerHTML
      .replace(/<p><br><\/p>/g, "\n\n")
      .replace(/<\/p><p>/g, "\n")
      .replace(/&nbsp;/g, " ")
      .replace(/<\/span>/g, "\n");
    // Retrieve the text property of the element (cross-browser support)
    return temporalDivElement.textContent || temporalDivElement.innerText || "";
  }

  getAcceptanceCriteria(testcaseDetail) {
    let requirementArray = [];
    requirementArray.push(["Acceptance Criteria : "])
    for (let i = 0; i < testcaseDetail.trd.length; i++) {
      try {
        let acList = JSON.parse(testcaseDetail.trd[i])
        requirementArray.push([acList.userStory])
        for (let criteriaIndex = 0; criteriaIndex < acList.criteria.length; criteriaIndex++) {
          let ACTEXTCREATION = '';
          ACTEXTCREATION = ACTEXTCREATION + '\n' + (criteriaIndex + 1) + '.' + acList.criteria[criteriaIndex].Desc
          if (acList.criteria[criteriaIndex].subpoint) {
            for (let subpointIndex = 0; subpointIndex < acList.criteria[criteriaIndex].subpoint.length; subpointIndex++) {
              ACTEXTCREATION = ACTEXTCREATION + '\n \t' + (subpointIndex + 1) + '.' + acList.criteria[criteriaIndex].subpoint[subpointIndex].Desc
              if (acList.criteria[criteriaIndex].subpoint[subpointIndex].subpoint) {
                for (let secondSubpointIndex = 0; secondSubpointIndex < acList.criteria[criteriaIndex].subpoint[subpointIndex].subpoint.length; secondSubpointIndex++) {
                  ACTEXTCREATION = ACTEXTCREATION + '\n \t \t' + acList.criteria[criteriaIndex].subpoint[subpointIndex].subpoint[secondSubpointIndex].Desc
                }
              }
            }
          }
          requirementArray.push([ACTEXTCREATION]);
        } 
      } catch (error) {
        requirementArray.push([testcaseDetail.trd[i]]);
      }
    }
    return requirementArray
  }

  getRequirementDetails(testcaseDetail) {
    let requirementArray = [];
    if (testcaseDetail.trdMappings && testcaseDetail.trdMappings.length !== 0) {
      testcaseDetail.trdMappings.forEach((trd) => {
        const temp = [
          trd.trdID,
          this.getInnerText(trd.description),
        ];
        requirementArray.push(temp);
      });
    }
    else if (testcaseDetail.sprintDetails && testcaseDetail.sprintDetails.length !== 0) {
      testcaseDetail.sprintDetails.forEach((sprintDetail) => {
        const temp = [
          sprintDetail.sprintID,
          sprintDetail.userStories,
        ];
        requirementArray.push(temp);
      });
    }
    return requirementArray
  }
  createTestcaseDetailsJson(testcaseDetail) {
    let testCaseArray = [];
    testCaseArray.push(["Test Case Name:", testcaseDetail.tcname]);
    testCaseArray.push(["Priority:", testcaseDetail.priority]);
    if (testcaseDetail.trdMappings && testcaseDetail.trdMappings.length !== 0) {
      testCaseArray.push(["Requirement ", "TRD"]);
      testCaseArray.push(["Details :"]);
    } else if (testcaseDetail.otherMapping && testcaseDetail.otherMapping.length !== 0) {
      testCaseArray.push(["Requirement ", "Others"]);
      testCaseArray.push(["Details ", testcaseDetail.otherMapping]);
    } else if (testcaseDetail.sprintDetails && testcaseDetail.sprintDetails.length !== 0) {
      testCaseArray.push(["Requirement ", "User Story"]);
      testCaseArray.push(["Details :"]);
    }
    return testCaseArray
  }
  printAsPdf(fileName, testCasesToExport, isPDFDownload = false) {
    const doc = new jsPDF();
    if (doc.autoTable.previous.finalY !== undefined) {
      doc.autoTable.previous.finalY = undefined;
    }
    doc.rect(7, 12, doc.internal.pageSize.width - 12, doc.internal.pageSize.height - 25, "S");
    /* The following array of object as response from the API req  */
    let c = 17;
    const y = 7;
    doc.setFontSize(10);
    doc.setFont("times");
    doc.setFontType("bold");
    doc.text(fileName, y + 78, 10);
    testCasesToExport.forEach((element) => {
      const col = ["Step Name", "Description", "Expected Result"];
      const rows = [];
      const rows1 = [];
      const lineHeight = doc.getLineHeight("Test Case ID :") / doc.internal.scaleFactor;
      doc.rect(7, 12, doc.internal.pageSize.width - 12, doc.internal.pageSize.height - 25, "S");
      if (doc.autoTable.previous.finalY > 252) {
        doc.addPage();
        c = 17;
      } else {
        c = doc.autoTable.previous.finalY !== undefined ? doc.autoTable.previous.finalY + 10 : 17;
      }
      doc.setFontType("bold");
      doc.text("Test Case ID :" + element.testcaseId, y, c);
      doc.setFontType("normal");
      doc.autoTable({
        body: this.createTestcaseDetailsJson(element),
        bodyStyles: {
          fillColor: [255, 255, 255],
          textColor: [0, 0, 0],
          lineColor: [255, 255, 255],
          lineWidth: 0.3,
        },

        theme: "grid",
        startY: c + lineHeight,
        margin: { horizontal: 8, vertical: 18 },
        styles: {
          overflow: "linebreak",
          cellWidth: "auto",
          font: "times",
          fontSize: 10,
        },
        columnStyles: { 0: { cellWidth: 30 } },
      });
      doc.setDrawColor(0, 0, 0);

      /* Requirements */
      if ((element.trdMappings && element.trdMappings.length !== 0) || (element.sprintDetails && element.sprintDetails.length !== 0)) {
        doc.autoTable((element.trdMappings && element.trdMappings.length !== 0) ? ["TRD ID", "Description"] : ["User Story", "Sprint Details"], this.getRequirementDetails(element), {
          // body: ,
          headStyles: {
            fillColor: [255, 255, 255],
            textColor: [0, 0, 0],
            lineColor: [0, 0, 0],
            lineWidth: 0.3,
          },
          bodyStyles: {
            fillColor: [255, 255, 255],
            textColor: [0, 0, 0],
            lineColor: [0, 0, 0],
            lineWidth: 0.3,
          },

          theme: "grid",
          startY: doc.previousAutoTable.finalY,
          margin: { horizontal: 8, vertical: 18 },
          styles: {
            overflow: "linebreak",
            cellWidth: "auto",
            font: "times",
            fontSize: 10,
          },
          columnStyles: { 0: { cellWidth: 30 } },
        });
      }

      doc.setDrawColor(0, 0, 0);
      doc.rect(7, 12, doc.internal.pageSize.width - 12, doc.internal.pageSize.height - 25, "S");
      /* Acceptance Criteria */
      if (element.trd && element.trd.length !== 0) {
        doc.autoTable({
          body: this.getAcceptanceCriteria(element),
          bodyStyles: {
            fillColor: [255, 255, 255],
            textColor: [0, 0, 0],
            lineColor: [255, 255, 255],
            lineWidth: 0.3,
          },

          theme: "grid",
          startY: doc.previousAutoTable.finalY + 7,
          margin: { horizontal: 8, },
          styles: {
            overflow: "linebreak",
            cellWidth: "auto",
            font: "times",
            fontSize: 10,
          },
        });
      }

      /* test steps */
      let data = element.testSteps.filter((_data) =>
        _data.stepName.toLowerCase().includes("step")
      );
      data = data.sort(function (a, b) {
        if (
          a.stepName.toLowerCase().includes("step") &&
          b.stepName.toLowerCase().includes("step")
        ) {
          const first = parseInt(
            a.stepName.toLowerCase().split("step")[1].trim(),
            0
          );
          const second = parseInt(
            b.stepName.toLowerCase().split("step")[1].trim(),
            0
          );

          if (first < second) {
            return -1;
          }
          if (first > second) {
            return 1;
          }
        }
        return 0;
      });
      if (this.checkForObjective(element.testSteps).length !== 0) {
        let objective_data = this.checkForObjective(element.testSteps);
        for (let index = objective_data.length - 1; index > -1; index--) {
          data.splice(0, 0, objective_data[index]);
        }
      }
      data.forEach((testSteps) => {
        const temp = [
          testSteps.stepName,
          this.getInnerText(testSteps.description),
          this.getInnerText(testSteps.expectedResult),
        ];
        rows.push(temp);
      });
      doc.autoTable({
        body: [["Test Procedure :"]],
        bodyStyles: {
          fillColor: [255, 255, 255],
          textColor: [0, 0, 0],
          lineColor: [255, 255, 255],
          lineWidth: 0,
        },
        theme: "grid",
        startY: doc.previousAutoTable.finalY + 7,
        margin: { horizontal: 8 },
        styles: { cellWidth: "auto", font: "times", fontSize: 10 },
        columnStyles: { 0: { cellWidth: 30 } },
      });

      doc.setDrawColor(0, 0, 0);
      doc.rect(
        7,
        12,
        doc.internal.pageSize.width - 12,
        doc.internal.pageSize.height - 25,
        "S"
      );
      doc.autoTable(col, rows, {
        headStyles: {
          fillColor: [255, 255, 255],
          textColor: [0, 0, 0],
          lineColor: [0, 0, 0],
          lineWidth: 0.3,
        },
        bodyStyles: {
          fillColor: [255, 255, 255],
          textColor: [0, 0, 0],
          lineColor: [0, 0, 0],
          lineWidth: 0.3,
        },
        startY: doc.previousAutoTable.finalY,
        theme: "grid",
        includeHiddenHtml: true,
        margin: { horizontal: 8, vertical: 18 },
        styles: { cellWidth: "auto", font: "times", fontSize: 10 },
        columnStyles: {
          0: { cellWidth: 25 },
          1: { cellWidth: 90, halign: "left" },
        },
      });

      doc.setDrawColor(0, 0, 0);
      doc.rect(
        7,
        12,
        doc.internal.pageSize.width - 12,
        doc.internal.pageSize.height - 25,
        "S"
      );
    });
    this.addFooter(doc); //add page number in footer
    if (isPDFDownload) {
      doc.save(fileName.split(".").join("_"));
    } else {
      doc.autoPrint();
      doc.output("dataurlnewwindow");
    }
  }

  checkForObjective(testSteps, testcase = true) {
    if (testcase) {
      return testSteps.filter((step) => {
        if (!step.stepName.toLowerCase().includes("step")) {
          return true;
        }
      });
    } else {
      return testSteps.filter((step) => {
        if (!step.stepname.toLowerCase().includes("step")) {
          return true;
        }
      });
    }
  }

  parseTestCase(testCasesToExport: any[], withoutTestSteps) {
    const data = [];
    if (withoutTestSteps) {
      for (let index = 0; index < testCasesToExport.length; index++) {
        data.push({
          "Test Case Id": testCasesToExport[index].testcaseId,
          "Test Case Name": testCasesToExport[index].tcname,
          Priority: testCasesToExport[index].priority,
        });
      }
    } else {
      for (let index = 0; index < testCasesToExport.length; index++) {
        let _tdata = testCasesToExport[index].testSteps.filter((_data) =>
          _data.stepName.toLowerCase().includes("step")
        );
        _tdata = _tdata.sort(function (a, b) {
          if (
            a.stepName.toLowerCase().includes("step") &&
            b.stepName.toLowerCase().includes("step")
          ) {
            const first = parseInt(
              a.stepName.toLowerCase().split("step")[1].trim(),
              0
            );
            const second = parseInt(
              b.stepName.toLowerCase().split("step")[1].trim(),
              0
            );

            if (first < second) {
              return -1;
            }
            if (first > second) {
              return 1;
            }
          }
          return 0;
        });
        if (
          this.checkForObjective(testCasesToExport[index].testSteps).length !== 0
        ) {
          let objective_data = this.checkForObjective(
            testCasesToExport[index].testSteps
          );
          for (let index = objective_data.length - 1; index > -1; index -= 1) {
            _tdata.splice(0, 0, objective_data[index]);
          }
        }
        for (let stepsIndex = 0; stepsIndex < _tdata.length; stepsIndex++) {
          data.push({
            "Test Case Id": testCasesToExport[index].testcaseId,
            "Test Case Name": testCasesToExport[index].tcname,
            Priority: testCasesToExport[index].priority,
            "Test Step Name": _tdata[stepsIndex].stepName,
            "Test Step Description": this.getInnerText(
              _tdata[stepsIndex].description
            ),
            "Expected Result": this.getInnerText(
              _tdata[stepsIndex].expectedResult
            ),
          });
        }
      }
    }
    return data;
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE,
    });
    FileSaver.saveAs(data, fileName.split(".").join("_") + EXCEL_EXTENSION);
  }

  downloadImageAsPdf(Image, type) {
    let pdf; // A4 size page of PDF
    const position = 20;
    html2canvas(Image).then((canvas) => {
      if (canvas.width > canvas.height) {
        pdf = new jsPDF("l", "mm", "a4");
      } else {
        pdf = new jsPDF("p", "mm", "a4");
      }
      const contentDataURL = canvas.toDataURL("image/png");
      const y = 7;
      pdf.setFontSize(12);
      pdf.setFontType("bold");
      pdf.text("Comparison Report", y, 10);
      if (canvas.height * 0.15 < pdf.internal.pageSize.height - 28) {
        console.log(1);
        
        pdf.addImage(
          contentDataURL,
          "PNG",
          7,
          position,
          pdf.internal.pageSize.width - 30,
          canvas.height * 0.15,
          "",
          "FAST"
        );
      } else {
        console.log(2);
        pdf.addImage(
          contentDataURL,
          "PNG",
          7,
          position,
          pdf.internal.pageSize.width - 15,
          pdf.internal.pageSize.height - 28,
          "",
          "FAST"
        );
      }
      if (type === "print") {
        pdf.autoPrint();
        pdf.output("dataurlnewwindow");
      } else {
        pdf.save("Comparison Report");
      }
    });
  }

  downloadAsPpt(Image) {
    const pptx = new PptxGenJS();
    const slide = pptx.addNewSlide();
    slide.addText("Test Run Comparison Report", {
      x: 2,
      y: 2,
      font_size: 15,
      color: "363636",
    });

    html2canvas(Image).then((canvas1) => {
      const slide4 = pptx.addNewSlide();
      const contentDataURL1 = canvas1.toDataURL("image/png");
      if (canvas1.height < 400) {
        slide4.addImage({
          data: contentDataURL1 + "",
          x: 0.1,
          y: 0.1,
          w: 9.7,
          h: 3,
        });
      } else {
        slide4.addImage({
          data: contentDataURL1 + "",
          x: 0.1,
          y: 0.1,
          w: 9.7,
          h: 5.3,
        });
      }

      pptx.save("Test Run Comparison Report");
    });
  }
  printReportAsPdf(fileName, testReportToExport, type, comment) {
    const doc = new jsPDF();
    if (doc.autoTable.previous.finalY !== undefined) {
      doc.autoTable.previous.finalY = undefined;
    }
    let c = 17;
    const y = 7;
    doc.setFontSize(10);
    doc.setFont("times");
    doc.setFontType("bold");
    doc.text(fileName, y + 50, 10);
    if (comment.length !== 0) {
      const commentRow = [];
      const commentcol = ["Comments"];
      comment.forEach((element) => {
        commentRow.push([
          element.commentedBy +
          " on " +
          new DatePipe("en-EN")
            .transform(element.commentedDate, "MM/dd/yyyy hh:mm:ss a")
            .toString() +
          " \n" +
          element.comment,
        ]);
      });
      doc.autoTable(commentcol, commentRow, {
        body: commentRow,
        headStyles: {
          fillColor: [255, 255, 255],
          textColor: [0, 0, 0],
          lineColor: [120, 144, 156],
          lineWidth: 0.5,
        },
        bodyStyles: {
          fillColor: [255, 255, 255],
          textColor: [0, 0, 0],
          lineColor: [120, 144, 156],
          lineWidth: 0.5,
        },
        theme: "striped",
        startY: c,
        margin: { horizontal: 8 },
        styles: { overflow: "linebreak", cellWidth: "auto", font: "times" },
        columnStyles: { 0: { cellWidth: 25 }, 1: { cellWidth: 80 } },
      });
    }

    testReportToExport.forEach((element) => {
      const col = [
        "Step Name",
        "Description",
        "Expected Result",
        "Actual Result",
        "Status",
      ];
      const rows = [];
      const rows1 = [];

      var lineHeight =
        doc.getLineHeight("Test Case ID :") / doc.internal.scaleFactor;
      if (doc.autoTable.previous.finalY === undefined) {
        doc.rect(
          7,
          12,
          doc.internal.pageSize.width - 12,
          doc.internal.pageSize.height - 25,
          "S"
        );
        doc.setFontType("bold");
        doc.text("Test Case ID :" + element.testcaseId, y, c);
        doc.setFontType("normal");
        const temp = [
          ["Test Case Name:", element.testcaseName],
          ["Priority:", this.getInnerText(element.priority)],
          ["Tester:", this.getInnerText(element.testerName)],
          ["Build Version:", this.getInnerText(element.buildVersion)],
          ["Result:", this.getInnerText(element.status)],
          ["Defect:", this.getInnerText(element.defectsList)],
          ["Test Procedure :"],
        ];

        for (let index = 0; index < temp.length; index++) {
          if (temp[index][1] === "undefined") {
            temp[index][1] = "Not Run";
          }
        }
        temp.forEach((element) => {
          rows1.push(element);
        });

        doc.autoTable({
          body: rows1,
          bodyStyles: {
            fillColor: [255, 255, 255],
            textColor: [0, 0, 0],
            lineColor: [255, 255, 255],
            lineWidth: 0.3,
          },
          theme: "grid",
          startY: c + lineHeight,
          margin: { horizontal: 8 },
          styles: { overflow: "linebreak", cellWidth: "auto", font: "times" },
          columnStyles: { 0: { cellWidth: 30 } },
        });
        let data = element.testSteps.filter((_data) =>
          _data.stepname.toLowerCase().includes("step")
        );
        data = data.sort(function (a, b) {
          if (
            a.stepname.toLowerCase().includes("step") &&
            b.stepname.toLowerCase().includes("step")
          ) {
            const first = parseInt(
              a.stepname.toLowerCase().split("step")[1].trim(),
              0
            );
            const second = parseInt(
              b.stepname.toLowerCase().split("step")[1].trim(),
              0
            );

            if (first < second) {
              return -1;
            }
            if (first > second) {
              return 1;
            }
          }
          return 0;
        });
        if (this.checkForObjective(element.testSteps, false).length !== 0) {
          let objective_data = this.checkForObjective(element.testSteps, false);
          for (let index = objective_data.length - 1; index > -1; index--) {
            data.splice(0, 0, objective_data[index]);
          }
        }
        data.forEach((testSteps) => {
          const temp = [
            testSteps.stepname,
            this.getInnerText(testSteps.description),
            this.getInnerText(testSteps.expectedResult),
            this.getInnerText(testSteps.actualResult),
            this.getInnerText(testSteps.status),
          ];

          rows.push(temp);
        });
        doc.autoTable(col, rows, {
          headStyles: {
            fillColor: [255, 255, 255],
            textColor: [0, 0, 0],
            lineColor: [0, 0, 0],
            lineWidth: 0.3,
          },
          bodyStyles: {
            fillColor: [255, 255, 255],
            textColor: [0, 0, 0],
            lineColor: [0, 0, 0],
            lineWidth: 0.3,
          },
          startY: c + 65,
          theme: "grid",
          margin: { horizontal: 8 },
          styles: { overflow: "linebreak", cellWidth: "auto", font: "times" },
          columnStyles: {
            0: { cellWidth: 25 },
            1: { cellWidth: 50 },
            2: { cellWidth: 50 },
            3: { cellWidth: 50 },
          },
        });
      } else {
        if (doc.autoTable.previous.finalY > 252) {
          doc.addPage();
          lineHeight =
            doc.getLineHeight("Test Case ID :") / doc.internal.scaleFactor;
          doc.rect(
            7,
            12,
            doc.internal.pageSize.width - 12,
            doc.internal.pageSize.height - 25,
            "S"
          );
          c = 17;
        } else {
          doc.rect(
            7,
            12,
            doc.internal.pageSize.width - 12,
            doc.internal.pageSize.height - 25,
            "S"
          );
          c = doc.autoTable.previous.finalY + 10;
        }
        doc.setFontType("bold");
        doc.text("Test Case ID :" + element.testcaseId, y, c);
        doc.setFontType("normal");
        const temp = [
          ["Test Case Name:", element.testcaseName],
          ["Priority:", this.getInnerText(element.priority)],
          ["Tester:", this.getInnerText(element.testerName)],
          ["Build Version:", this.getInnerText(element.buildVersion)],
          ["Result:", this.getInnerText(element.status)],
          ["Defect:", this.getInnerText(element.defectsList)],
          ["Test Procedure :"],
        ];

        for (let index = 0; index < temp.length; index++) {
          if (temp[index][1] === "undefined") {
            temp[index][1] = "Not Run";
          }
        }
        temp.forEach((element) => {
          rows1.push(element);
        });
        doc.autoTable({
          body: rows1,
          bodyStyles: {
            fillColor: [255, 255, 255],
            textColor: [0, 0, 0],
            lineColor: [255, 255, 255],
            lineWidth: 0.3,
          },
          theme: "grid",
          startY: c + lineHeight,
          margin: { horizontal: 8 },
          styles: { overflow: "linebreak", cellWidth: "auto", font: "times" },
          columnStyles: { 0: { cellWidth: 30 } },
        });
        if (doc.autoTable.previous.finalY > 252) {
          doc.addPage();
          lineHeight =
            doc.getLineHeight("Test Case ID :") / doc.internal.scaleFactor;
          doc.rect(
            7,
            12,
            doc.internal.pageSize.width - 12,
            doc.internal.pageSize.height - 25,
            "S"
          );
          c = 17;
        } else {
          doc.rect(
            7,
            12,
            doc.internal.pageSize.width - 12,
            doc.internal.pageSize.height - 25,
            "S"
          );
          c = doc.autoTable.previous.finalY + 5;
        }
        let data = element.testSteps.filter((_data) =>
          _data.stepname.toLowerCase().includes("step")
        );
        data = data.sort(function (a, b) {
          if (
            a.stepname.toLowerCase().includes("step") &&
            b.stepname.toLowerCase().includes("step")
          ) {
            const first = parseInt(
              a.stepname.toLowerCase().split("step")[1].trim(),
              0
            );
            const second = parseInt(
              b.stepname.toLowerCase().split("step")[1].trim(),
              0
            );

            if (first < second) {
              return -1;
            }
            if (first > second) {
              return 1;
            }
          }
          return 0;
        });
        if (this.checkForObjective(element.testSteps, false).length !== 0) {
          let objective_data = this.checkForObjective(element.testSteps, false);
          for (let index = objective_data.length - 1; index > -1; index -= 1) {
            data.splice(0, 0, objective_data[index]);
          }
        }

        data.forEach((testSteps) => {
          const temp = [
            testSteps.stepname,
            this.getInnerText(testSteps.description),
            this.getInnerText(testSteps.expectedResult),
            this.getInnerText(testSteps.actualResult),
            this.getInnerText(testSteps.status),
          ];
          rows.push(temp);
        });

        doc.autoTable(col, rows, {
          headStyles: {
            fillColor: [255, 255, 255],
            textColor: [0, 0, 0],
            lineColor: [0, 0, 0],
            lineWidth: 0.3,
          },
          bodyStyles: {
            fillColor: [255, 255, 255],
            textColor: [0, 0, 0],
            lineColor: [0, 0, 0],
            lineWidth: 0.3,
          },
          theme: "grid",
          startY: c,
          margin: { horizontal: 8 },
          styles: { overflow: "linebreak", cellWidth: "auto", font: "times" },
          columnStyles: {
            0: { cellWidth: 25 },
            1: { cellWidth: 50 },
            2: { cellWidth: 50 },
            3: { cellWidth: 50 },
          },
        });
        doc.rect(
          7,
          12,
          doc.internal.pageSize.width - 12,
          doc.internal.pageSize.height - 25,
          "S"
        );
        //doc.setDrawColor(0, 0, 0);
      }
    });
    this.addFooter(doc);
    //Based on type file is printed or downloaded
    if (type === "print") {
      doc.autoPrint();
      window.open(doc.output("bloburl"), "_blank");
    } else {
      doc.save(fileName.split(".").join("_"));
    }
  }
  addFooter(doc) {
    const pageCount = doc.internal.getNumberOfPages();
    for (var i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.text("Page " + String(i) + " of " + String(pageCount), 100, 288, {
        align: "center",
      });
    }
  }
  parseTestReports(testReportToExport: any[], withoutTestSteps) {
    const data = [];
    if (withoutTestSteps) {
      for (let index = 0; index < testReportToExport.length; index++) {
        data.push({
          "Test Case Id": testReportToExport[index].testcaseId,
          "Test Case Name": testReportToExport[index].testcaseName,
          Priority: testReportToExport[index].priority,
          Tester: testReportToExport[index].testerName,
          "Build Version": testReportToExport[index].buildVersion,
          Result: testReportToExport[index].testcaseResult,
        });
      }
    } else {
      for (let index = 0; index < testReportToExport.length; index++) {
        let _tdata = testReportToExport[index].testSteps.filter((_data) =>
          _data.stepname.toLowerCase().includes("step")
        );
        _tdata = _tdata.sort(function (a, b) {
          if (
            a.stepname.toLowerCase().includes("step") &&
            b.stepname.toLowerCase().includes("step")
          ) {
            const first = parseInt(
              a.stepname.toLowerCase().split("step")[1].trim(),
              0
            );
            const second = parseInt(
              b.stepname.toLowerCase().split("step")[1].trim(),
              0
            );

            if (first < second) {
              return -1;
            }
            if (first > second) {
              return 1;
            }
          }
          return 0;
        });
        if (
          this.checkForObjective(testReportToExport[index].testSteps, false)
            .length !== 0
        ) {
          let objective_data = this.checkForObjective(
            testReportToExport[index].testSteps,
            false
          );
          for (let index = objective_data.length - 1; index > -1; index--) {
            _tdata.splice(0, 0, objective_data[index]);
          }
        }
        for (let stepsIndex = 0; stepsIndex < _tdata.length; stepsIndex++) {
          data.push({
            "Test Case Id": testReportToExport[index].testcaseId,
            "Test Case Name": testReportToExport[index].testcaseName,
            Priority: testReportToExport[index].priority,
            Tester: testReportToExport[index].testerName,
            "Build Version": testReportToExport[index].buildVersion,
            Result: testReportToExport[index].status,
            "Test Step Name": _tdata[stepsIndex].stepname,
            "Test Step Description": this.getInnerText(
              _tdata[stepsIndex].description
            ),
            "Expected Result": this.getInnerText(
              _tdata[stepsIndex].expectedResult
            ),
            "Actual Result": this.getInnerText(_tdata[stepsIndex].actualResult),
            Status: this.getInnerText(_tdata[stepsIndex].status),
          });
        }
      }
    }
    return data;
  }
  exportExecutiveReport(fileName, data, Image, type) {
    let pdf = new jsPDF(); // A4 size page of PDF
    let c = 15;
    pdf.setFontSize(10);
    pdf.setFontType("bold");
    pdf.rect(
      7,
      12,
      pdf.internal.pageSize.width - 12,
      pdf.internal.pageSize.height - 25,
      "S"
    );
    if (Image) {
      html2canvas(Image).then((canvas) => {
        pdf.text(fileName, pdf.internal.pageSize.width / 2, 10, "center");
        const contentDataURL = canvas.toDataURL("image/png");
        pdf.addImage(
          contentDataURL,
          "png",
          10,
          20,
          pdf.internal.pageSize.width - 25,
          (canvas.height * 280) / canvas.width,
          "",
          "FAST"
        );
        const nextImgPosition = 20 + (canvas.height * 280) / canvas.width;
        html2canvas(data, { scrollY: -window.scrollY, scale: 2 }).then(
          (canvas1) => {
            const contentDataURL = canvas1.toDataURL("image/png", 3);
            let imgWidth = 180;
            let pageHeight = pdf.internal.pageSize.height;
            let imgHeight = (canvas1.height * 280) / canvas1.width;
            let heightLeft = imgHeight;
            let position = 100;
            pdf.addImage(
              contentDataURL,
              "PNG",
              10,
              nextImgPosition + 10,
              pdf.internal.pageSize.width - 20,
              imgHeight
            );
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
              position = heightLeft - imgHeight;
              pdf.addPage();
              pdf.addImage(
                contentDataURL,
                "PNG",
                c,
                position,
                imgWidth,
                imgHeight
              );
              heightLeft -= pageHeight;
            }
            if (type === "print") {
              pdf.autoPrint();
              window.open(
                pdf.output("bloburl", { filename: fileName + ".pdf" }),
                "_blank"
              );
            } else {
              pdf.save(fileName + ".pdf");
            }
          }
        );
      });
    } else {
      html2canvas(data, { scrollY: -window.scrollY, scale: 2 }).then(
        (canvas) => {
          pdf.text(fileName, pdf.internal.pageSize.width / 2, 10, "center");
          const contentDataURL = canvas.toDataURL("image/png", 3);
          let imgWidth = 180;
          let pageHeight = pdf.internal.pageSize.height;
          let imgHeight = (canvas.height * 280) / canvas.width;
          let heightLeft = imgHeight;
          let position = 100;
          pdf.addImage(
            contentDataURL,
            "PNG",
            10,
            20,
            pdf.internal.pageSize.width - 20,
            imgHeight
          );
          heightLeft -= pageHeight;

          while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(
              contentDataURL,
              "PNG",
              c,
              position,
              imgWidth,
              imgHeight
            );
            heightLeft -= pageHeight;
          }
          if (type === "print") {
            pdf.autoPrint();
            window.open(
              pdf.output("bloburl", { filename: fileName + ".pdf" }),
              "_blank"
            );
          } else {
            pdf.save(fileName + ".pdf");
          }
        }
      );
    }
  }
  downloadTPReportAsPdf(fileName, data, type, vendor = false) {
    const doc = new jsPDF();
    var col = [];
    if (vendor) {
      col = [
        "Build Version",
        "Test Start Date",
        "Location",
        "Total",
        "Pass",
        "Fail",
        "Status",
      ];
    } else {
      col = [
        "TestPlan Name",
        "Test Run ID",
        "Build Version",
        "Total Tests",
        "Pass",
        "Fail",
      ];
    }
    let c = 7;
    const rows = [];
    doc.rect(
      7,
      12,
      doc.internal.pageSize.width - 12,
      doc.internal.pageSize.height - 25,
      "S"
    );
    doc.setFont("times");
    doc.setFontSize(10);
    doc.setFontType("bold");
    doc.text(fileName, 37, 10);
    if (vendor) {
      this.vendorReporttoPdf(data, doc, col);
    } else {
      data.forEach((testSteps) => {
        const testRunsForFinalResult = testSteps.testRunDetails.filter(
          (_data) => _data.selected
        );
        const temp = [
          this.getInnerText(testSteps.testplanName),
          testRunsForFinalResult
            .map((_data) => _data.testrunId)
            .toString()
            .split(",")
            .join("\n"),
          testRunsForFinalResult
            .map((_data) => _data.buildversion)
            .toString()
            .split(",")
            .join("\n"),
          this.getInnerText(testSteps.totaltestcases),
          this.getInnerText(testSteps.pass),
          this.getInnerText(testSteps.fail),
        ];
        for (let index = 0; index < temp.length; index++) {
          if (temp[index] === "") {
            temp[index] = "Not Run";
          }
        }
        rows.push(temp);
      });

      doc.autoTable(col, rows, {
        headStyles: {
          fillColor: [255, 255, 255],
          textColor: [0, 0, 0],
          lineColor: [0, 0, 0],
          lineWidth: 0.3,
        },
        bodyStyles: {
          fillColor: [255, 255, 255],
          textColor: [0, 0, 0],
          lineColor: [0, 0, 0],
          lineWidth: 0.3,
        },
        theme: "grid",
        startY: c + 10,
        margin: { horizontal: 7.5 },
        styles: { overflow: "linebreak", cellWidth: "auto" },
        columnStyles: {
          0: { cellWidth: 45 },
          1: { cellWidth: 50 },
          2: { cellWidth: 45 },
        },
      });
    }
    this.addFooter(doc);
    //c = doc.autoTable.previous.finalY + 5;
    doc.setDrawColor(0, 0, 0);
    if (type === "print") {
      doc.autoPrint();
      doc.output("dataurlnewwindow");
    } else {
      if (!vendor) {
        fileName = "TestPlan_Repot_of_" + fileName + ".pdf";
      }
      doc.save(fileName);
    }
  }
  vendorReporttoPdf(data, doc, col) {
    let y = 7;
    let c = 17;
    data.forEach((testSteps) => {
      doc.rect(
        7,
        12,
        doc.internal.pageSize.width - 12,
        doc.internal.pageSize.height - 25,
        "S"
      );
      const rows1 = [];
      const rows = [];
      doc.setFontType("bold");
      doc.text("Test Case ID :" + testSteps.testrunId, y, c + 2);
      const startDate = new DatePipe("en-EN").transform(
        testSteps.dateofTestrun,
        "MM/dd/yyyy",
        "UTC"
      );
      const temp = [
        this.getInnerText(testSteps.buildVersion[0].buildName),
        startDate,
        this.getInnerText(testSteps.location),
        this.getInnerText(testSteps.total),
        this.getInnerText(testSteps.passCount),
        this.getInnerText(testSteps.failCount),
        this.getInnerText(testSteps.status),
      ];

      const data = [
        ["Tester:", this.getInnerText(testSteps.testerName)],
        ["TestPlan:", this.getInnerText(testSteps.testplanName)],
        ["Vendor:", this.getInnerText(testSteps.vendor)],
        ["DUT:", this.getInnerText(testSteps.dut)],
      ];

      data.forEach((element) => {
        rows1.push(element);
      });
      doc.autoTable({
        body: rows1,
        bodyStyles: {
          fillColor: [255, 255, 255],
          textColor: [0, 0, 0],
          lineColor: [255, 255, 255],
          lineWidth: 0.3,
        },
        theme: "grid",
        startY: c + 5,
        margin: { horizontal: 7.5 },
        styles: { overflow: "linebreak", font: "times", fontSize: 10 },
        columnStyles: { 0: { cellWidth: 30 }, 1: { cellWidth: 70 } },
      });
      c = doc.autoTable.previous.finalY;
      rows.push(temp);
      doc.autoTable(col, rows, {
        headStyles: {
          fillColor: [255, 255, 255],
          textColor: [0, 0, 0],
          lineColor: [0, 0, 0],
          lineWidth: 0.3,
        },
        bodyStyles: {
          fillColor: [255, 255, 255],
          textColor: [0, 0, 0],
          lineColor: [0, 0, 0],
          lineWidth: 0.3,
        },
        theme: "grid",
        startY: c + 5,
        margin: { horizontal: 7.5 },
        styles: { overflow: "linebreak", cellWidth: "auto", font: "times" },
      });
      c = doc.autoTable.previous.finalY + 5;
    });
  }
  downloadTPReportAsExcel(_tdata, filename, vendor = false) {
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    const data = [];
    if (vendor) {
      for (let stepsIndex = 0; stepsIndex < _tdata.length; stepsIndex++) {
        const startDate = new DatePipe("en-EN").transform(
          _tdata[stepsIndex].dateofTestrun,
          "MM/dd/yyyy",
          "UTC"
        );
        data.push({
          "Test Run ID": this.getInnerText(_tdata[stepsIndex].testrunId),
          "TestPlan Name": _tdata[stepsIndex].testplanName,
          Tester: _tdata[stepsIndex].testerName,
          Vendor: _tdata[stepsIndex].vendor,
          DUT: _tdata[stepsIndex].dut,
          "Test Start Date": startDate,
          Location: _tdata[stepsIndex].location,
          Total: this.getInnerText(_tdata[stepsIndex].total),
          Pass: this.getInnerText(_tdata[stepsIndex].passCount),
          Fail: this.getInnerText(_tdata[stepsIndex].failCount),
          Status: _tdata[stepsIndex].status,
        });
        for (
          let index = 0;
          index < _tdata[stepsIndex].buildVersion.length;
          index++
        ) {
          data[stepsIndex].Build_Version = this.getInnerText(
            _tdata[stepsIndex].buildVersion[index].buildName
          );
        }
      }
    } else {
      for (let stepsIndex = 0; stepsIndex < _tdata.length; stepsIndex++) {
        const testRunsForFinalResult = _tdata[stepsIndex].testRunDetails.filter(
          (_data) => _data.selected
        );
        data.push({
          "TestPlan Name": _tdata[stepsIndex].testplanName,
          "Test Run ID": testRunsForFinalResult
            .map((_data) => _data.testrunId)
            .toString(),
          "Build Version": testRunsForFinalResult
            .map((_data) => _data.buildversion)
            .toString(),
          "Total Tests": this.getInnerText(_tdata[stepsIndex].totaltestcases),
          Pass: this.getInnerText(_tdata[stepsIndex].pass),
          Fail: this.getInnerText(_tdata[stepsIndex].fail),
        });
        for (var key in data[stepsIndex]) {
          if (data[stepsIndex][key] === "") {
            data[stepsIndex][key] = "Not Run";
          }
        }
      }
    }

    var worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);

    XLSX.utils.book_append_sheet(workbook, worksheet, "Test Plan Reports");
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    if (!vendor) {
      filename = "TestPlan_Reports_" + filename;
    }

    this.saveAsExcelFile(excelBuffer, filename);
  }
}
