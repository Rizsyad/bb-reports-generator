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

  const dynamicBug = async () => {
    const data = await getDataJSON("en");
    delete data["templates"];

    $("#bug").append('<option value="">Select a bug</option>');

    // console.log(Object.keys(data));
    Object.keys(data).forEach(function (key) {
      // const value = jsonData[key];
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

  const generateTemplates = async () => {
    let name = $("#yn").val();
    let program = $("#pn").val();
    let linkWebsite = $("#lw").val();
    let bugs = $("#bugo").val() || $("#bug option:selected").val();
    let report = $("#report").val();
    let poc = $("#poc").val();
    let remediationC = $("#remediation").val();
    let referencesC = $("#references").val();
    let impactC = $("#impact").val();
    let severityC = $("#severity").val();
    let descriptionC = $("#description").val();
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
