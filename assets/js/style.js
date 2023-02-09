$(document).ready(function () {
  let template = templates;
  $("#send").addClass("disabled");
  $("#send").attr("href", "#");
  $("#other").hide();

  function generateTemplates() {
    let name = $("#yn").val();
    let program = $("#pn").val();
    let linkWebsite = $("#lw").val();
    let bugs = $("#bugo").val() || $("#bug option:selected").val();
    let poc = $("#poc").val();
    let remediation = $("#remediation").val();
    let refrences = $("#refrences").val();
    let impact = $("#impact").val();
    let severity = $("#severity").val();

    template = template.replace("{{name}}", name);
    template = template.replace("{{program}}", program);
    template = template.replace(new RegExp("{{website}}", "g"), linkWebsite);
    template = template.replace(new RegExp("{{bugs}}", "g"), bugs);
    template = template.replace("{{poc}}", poc);

    // information bugs
    template = template.replace(
      "{{remediation}}",
      template_informations?.[bugs]?.remediation || remediation
    );

    template = template.replace(
      "{{refrences}}",
      template_informations?.[bugs]?.refrences || refrences
    );

    template = template.replace(
      "{{impact}}",
      template_informations?.[bugs]?.impact || impact
    );

    template = template.replace(
      "{{severity}}",
      template_informations?.[bugs]?.severity || severity
    );

    $("#temp").val(template);

    let to = $("#email").val();
    let subject = `vulnerability ${bugs} on ${linkWebsite}`;

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
  }

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
    toastr.success("Copy to clipboard");
    navigator.clipboard.writeText($("#temp").val());
  });
});
