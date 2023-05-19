import Evaluation, { TypeEvaluation } from "@core/domain/entities/Evaluation";
import puppeteer from "puppeteer";
import hb from "handlebars";
import Assign from "@core/domain/entities/Assign";
import Group from "@core/domain/entities/Group";
import GroupLecturer from "@core/domain/entities/GroupLecturer";
import GroupMember from "@core/domain/entities/GroupMember";
import GroupLecturerMember from "@core/domain/entities/GroupLecturerMember";
import Lecturer from "@core/domain/entities/Lecturer";
// Example of options with args //

export default class GenerateEvalutionPDFDetail {
  private evaluations: Array<Evaluation>;
  private typeEvalution: TypeEvaluation;
  private groupMembers: Array<GroupMember>;
  private lecturer: Lecturer;
  constructor(
    evaluations: Array<Evaluation>,
    typeEvalution: TypeEvaluation,
    groupMembers: Array<GroupMember>,
    lecturer: Lecturer
  ) {
    this.assign = assign;
  }
  async excute() {
    return this.printPDF();
  }

  async printPDF() {
    const browser = await puppeteer.launch({
      // headless: false,
      // executablePath: revisionInfo?.executablePath,
      args: ["--no-sandbox", "--disabled-setupid-sandbox"],
      executablePath: "/usr/bin/chromium-browser",
    });
    const page = await browser.newPage();
    // const data = await inlineCss(dataHDoc, { url: '/' });
    // we have compile our code with handlebars
    const templateHTML = generateHTMLEvaluation(
      this.evaluations,
      this.evaluations[0]?.type
    );
    const template = hb.compile(templateHTML, { strict: true });
    const result = template(templateHTML);
    const html = result;

    await page.setContent(html, {
      waitUntil: "networkidle0",
      timeout: 4000, // wait for page to load completely
    });

    const buffer = await page.pdf({
      format: "A4",
    });

    await browser.close();

    return buffer;
  }
}
const generateHTMLEvaluation = (
  evaluations: Array<Evaluation>,
  typeEvalution: TypeEvaluation,
  groupMembers: Array<GroupMember>,
  lecturer: Lecturer
) => {
  const typeEvalutionHTML = typeEvalution
    ? typeEvalution == TypeEvaluation.ADVISOR
      ? "GV Hướng dẫn"
      : typeEvalution == TypeEvaluation.REVIEWER
      ? "Phản biện"
      : "Hội đồng"
    : "";
  const groupMemberHTML = groupMembers
    .map((member) => {
      return `<p> ${member.studentTerm?.student.username} - ${member.studentTerm?.student.name}</p>`;
    })
    .join("");
  const colHeaderStudent = groupMembers
    .map((member, index) => {
      return `<th>Điểm SV ${index + 1}</th>`;
    })
    .join("");
  const colBodytudent = groupMembers
    .map((member, index) => {
      return `<td></td>`;
    })
    .join("");
  const evaluationsHTML = evaluations
    .map((e, index) => {
      return `	<tr>
					<td>${index + 1}</td>
					<td class="text-left">${e.name}</td>
					<td>${e.gradeMax}</td>
					<td></td>
					<td></td>
					<td></td>
					<td></td>
				</tr>`;
    })
    .join("");
  return `
<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="UTF-8" />
	<meta http-equiv="X-UA-Compatible" content="IE=edge" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<title>Phiếu chấm</title>
</head>
<style>
	body {
		padding: 40px 40px;
		font-size: 12px;
		font-family: 'Times New Roman', Times, serif;
	}

	header {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	ol {
		font-weight: 600;
	}

	li {
		margin-top: 10px;
	}

	.content-info {
		padding: 0 40px;
		overflow-wrap: break-word;
	}

	table,
	th,
	td {
		border: 1px solid rgb(0, 0, 0);
		border-collapse: collapse;
	}

	table {
		margin-top: 10px;
		width: 100%;
		text-align: center;
	}

	thead {
		text-align: center;

	}

	.content-evaluation {
		text-align: center;
	}

	.content-evaluation td {
		padding: 15px 5px;
	}

	.content-footer {
		padding: 20px 70px;
		overflow-wrap: break-word;
	}

	.content-footer .date {
		display: flex;
		flex-direction: row-reverse;
		margin-top: 30px;
	}
	.date .content-date{
		text-align: center;
	}

	.text-left {
		text-align: left;
	}
</style>

<body>
	<header>
		<b>TRƯỜNG ĐH CÔNG NGHIỆP TP. HCM</b>
		<span>KHOA CÔNG NGHỆ THÔNG TIN</span>
		<span>=======//======</span>
		<br />
		<b>PHIẾU CHẤM ĐIỂM KHÓA LUẬN TỐT NGHIỆP</b>
	</header>
	<br />
	<div class="content-info">
		<ol>
			<li>Tên đề tài:</li>
			<li>
				Nhóm thực hiện:
				<br>
				<div style="font-weight: normal;">
					${groupMemberHTML}	
				</div>
			</li>
			<li>Họ tên người chấm điểm: ${lecturer.name}</li>
			<li>Vai trò của người đánh giá: <span style="font-weight: 400;"> ${typeEvalutionHTML} </span></li>
		</ol>
	</div>
	<div class="content-evaluation">
			<br />
		<h2>Nội dung đánh giá</h2>
		<table>
			<thead>
				<tr>
					<th style="width: 5%;">TT</th>
					<th style="width: 40%;">Nội dung</th>
					<th>Điểm tối đa</th>
					${colHeaderStudent}
					<th style="width: 25%;">CÁC Ý KIẾN NHẬN XÉT</th>
				</tr>
			</thead>
			<tbody>
				${evaluationsHTML}
				<tr>
					<td>&#x200B</td>
					<td>Cộng</td>
					<td>10</td>
					${colBodytudent}
					<td></td>
				</tr>
			</tbody>
		</table>
	</div>
	<br>
	<div class="content-footer">
		<b style=>Các góp ý cho khóa luận:</b>
		<span>………………………………………………………………………………………………………………………………………………………………………………………………………………………………………………………………………………………………………………………………………………………………………………………………………………………………………………</span>
		<div class="date">
			<div class="content-date">
				<span> TP. Hồ Chí Minh, ngày tháng năm </span>
				<br>
				<b> Người chấm điểm</b>
			</div>
		</div>
	</div>
</body>

</html>

`;
};
