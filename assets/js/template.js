const template_informations = {
  "SQL Injection": {
    remediation: `* One common defense is to double up any single quotation marks appearing within user input before incorporating that input into a SQL query. This defense is designed to prevent malformed data from terminating the string into which it is inserted. However, if the data being incorporated into queries is numeric, then the defense may fail, because numeric data may not be encapsulated within quotes, in which case only a space is required to break out of the data context and interfere with the query. Further, in second-order SQL injection attacks, data that has been safely escaped when initially inserted into the database is subsequently read from the database and then passed back to it again. Quotation marks that have been doubled up initially will return to their original form when the data is reused, allowing the defense to be bypassed.\n\n* Another often cited defense is to use stored procedures for database access. While stored procedures can provide security benefits, they are not guaranteed to prevent SQL injection attacks. The same kinds of vulnerabilities that arise within standard dynamic SQL queries can arise if any SQL is dynamically constructed within stored procedures. Further, even if the procedure is sound, SQL injection can arise if the procedure is invoked in an unsafe manner using user-controllable data.`,
    refrences: `* https://portswigger.net/web-security/sql-injection`,
    impact:
      "unauthorized viewing of user lists, the deletion of entire tables and, in certain cases, the attacker gaining administrative rights to a database",
    severity: "High",
  },
};

const templates = `
{{bugs}} on {{website}}

===============================================

Hello {{program}} team,

##Description##

I found {{bugs}} on {{website}}

##POC##

{{poc}}

##Remediation##

{{remediation}}

##Refrences##

{{refrences}}

##Typical severity##

{{severity}}

Best regards,
Thanks for your time .
{{name}}

##impact##

{{impact}}
`;
