$(document).ready(function () {
  $("#send").addClass("disabled");
  $("#send").attr("href", "#");
  $("#other").hide();

  const getDataJSON = async (fileName) => {
    const fileJSON = `reporting/${fileName}.json`;
    const response = await fetch(fileJSON);
    const json = await response.json();
    return json;
  };

  const generateTemplates = async () => {
    let name = $("#yn").val();
    let program = $("#pn").val();
    let linkWebsite = $("#lw").val();
    let bugs = $("#bugo").val() || $("#bug option:selected").val();
    let report = $("#report").val();
    let poc = $("#poc").val();
    let remediationC = $("#remediation").val();
    let refrencesC = $("#refrences").val();
    let impectC = $("#impect").val();
    let severityC = $("#severity").val();
    let descriptionC = $("#description").val();
    let language = $("#lang").val();
    let to = $("#email").val();

    const reporting = await getDataJSON(language);
    let template = reporting.templates;

    const { description, remediation, refrences, impect, severity, subject } =
      reporting?.[bugs] || {};

    template = template.replace(new RegExp("{{name}}", "g"), name);
    template = template.replace("{{program}}", program);
    template = template.replace(new RegExp("{{website}}", "g"), linkWebsite);
    template = template.replace(new RegExp("{{bugs}}", "g"), bugs);
    template = template.replace("{{poc}}", poc);
    template = template.replace("{{report}}", report);
    template = template.replace("{{description}}", description || descriptionC);
    template = template.replace("{{remediation}}", remediation || remediationC);
    template = template.replace("{{refrences}}", refrences || refrencesC);
    template = template.replace("{{impect}}", impect || impectC);
    template = template.replace("{{severity}}", severity || severityC);
    $("#temp").val(template);

    if (to == "") {
      $("#send").addClass("disabled");
      $("#send").attr("href", "#");
    } else {
      $("#send").removeClass("disabled");
      $("#send").attr(
        "href",
        `mailto:${to}?subject=${encodeURIComponent(
          subject
        )}&body=${encodeURIComponent(template)}`
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

  $("#generate").on("click", function () {
    generateTemplates();
  });

  $("#copy").on("click", function () {
    toastr.success("Copy to clipboard");
    navigator.clipboard.writeText($("#temp").val());
  });
});
