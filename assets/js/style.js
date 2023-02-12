$(document).ready(function () {
  $("#send").addClass("disabled");
  $("#send").attr("href", "#");
  $("#other").hide();
  $("textarea").summernote({
    tabsize: 2,
    height: 300,
    toolbar: [
      ["style", ["bold", "italic", "underline", "clear"]],

      ["insert", ["link", "picture", "video"]],
      ["view", ["fullscreen", "codeview", "help"]],
    ],
  });

  const getDataJSON = async (fileName) => {
    const fileJSON = `reporting/${fileName}.json`;
    const response = await fetch(fileJSON);
    const json = await response.json();
    return json;
  };

  const dynamicBug = async () => {
    const data = await getDataJSON("en");
    delete data["templates"];

    $("#bug").append('<option value="">Select a bug</option>');

    Object.keys(data).forEach(function (key) {
      $("#bug").append(
        $("<option>:first", {
          value: key,
          text: key,
        })
      );
    });
    $("#bug").append('<option value="other">Other</option>');
    $("option[value='']").attr("selected", true);
  };

  dynamicBug();

  const getCveData = async (cveid) => {
    const isCVE = cveid.slice(0, 3).toUpperCase() == "CVE";
    if (!isCVE) cveid = `CVE-${cveid}`;

    const fileJSON = `https://api.cvesearch.com/search?q=${cveid}`;
    const response = await fetch(fileJSON);
    const json = await response.json();
    return json.response[cveid.toLowerCase()];
  };

  const generateTemplates = async () => {
    let name = $("#yn").val();
    let program = $("#pn").val();
    let linkWebsite = $("#lw").val();
    let bugs = $("#bugo").val() || $("#bug option:selected").val();
    let report = $("#report").summernote("code");
    let poc = $("#poc").summernote("code");
    let remediationC = $("#remediation").summernote("code");
    let referencesC = $("#references").summernote("code");
    let impactC = $("#impact").summernote("code");
    let severityC = $("#severity").val();
    let descriptionC = $("#description").summernote("code");
    let language = $("#lang").val();
    let to = $("#email").val();

    const reporting = await getDataJSON(language);
    let template = reporting.templates;

    const { description, remediation, references, impact, severity, subject } =
      reporting?.[bugs] || {};

    template = template.replace(new RegExp("{{name}}", "g"), name);
    template = template.replace("{{program}}", program);
    template = template.replace(new RegExp("{{website}}", "g"), linkWebsite);
    template = template.replace(new RegExp("{{bugs}}", "g"), bugs);
    template = template.replace("{{poc}}", poc);
    template = template.replace("{{report}}", report);
    template = template.replace("{{description}}", description || descriptionC);
    template = template.replace("{{remediation}}", remediation || remediationC);
    template = template.replace("{{references}}", references || referencesC);
    template = template.replace("{{impact}}", impact || impactC);
    template = template.replace("{{severity}}", severity || severityC);
    $("#temp").summernote(
      "code",
      template.replace(new RegExp("\n", "g"), "<br />")
    );

    if (to == "") {
      $("#send").addClass("disabled");
      $("#send").attr("href", "#");
    } else {
      $("#send").removeClass("disabled");
      $("#send").attr(
        "href",
        `mailto:${to}?subject=${encodeURIComponent(
          subject || `[BUG BOUNTY REPORT] ${bugs}`
        )}&body=${encodeURIComponent("paste it")}`
      );
    }
  };

  $("#bug").on("change", function () {
    let value = $(this).val();
    if (value == "other") {
      $("#other").css("display", "block");
      return;
    }
    $("#other").css("display", "none");
    $("#bugo").val("");
  });

  $("#bugo").on("keypress", async function (e) {
    const key = e.which;
    if (key == 13) {
      const dataCVE = await getCveData($("#bugo").val());

      $("#references").summernote(
        "code",
        "* " + dataCVE?.references.join("<br/> * ") || ""
      );
      $("#severity").val(dataCVE?.details?.severity || "");
      $("#description").summernote("code", dataCVE?.basic?.description || "");

      return;
    }
  });

  $("#generate").on("click", function () {
    generateTemplates();
  });

  $("#copy").on("click", function () {
    toastr.success("Copy to clipboard");

    const $temp = $("<div>");
    $("body").append($temp);
    $temp
      .attr("contenteditable", true)
      .html($("#temp").val().replace(new RegExp("\n", "g"), "<br/ >"))
      .select()
      .on("focus", function () {
        document.execCommand("selectAll", false, null);
      })
      .focus();
    document.execCommand("copy");
    $temp.remove();
  });
});
