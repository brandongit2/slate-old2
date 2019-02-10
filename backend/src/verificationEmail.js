exports.verificationEmail = (name, query) => `
    <html>
        <head>
            <link rel="stylesheet" type="text/css" href="https://fonts.googleapis.com/css?family=Lato">
        </head>
        <body style="margin: 0px;">
            <table border="0" cellpadding="20" cellspacing="0" width="100%"><tr align="center"><td>
                <table border="0" cellpadding="0" cellspacing="0" style="max-width: 500px; border-width: 1px; border-style: solid; border-color: #cccccc; border-radius: 10px;">
                    <tr><td>
                        <table border="0" cellpadding="20" cellspacing="0"><tr><td>
                            <img src="http://localhost:8080/static/slate-logo.svg" height="35">
                        </td></tr></table>
                    </td></tr>
                    <tr><td>
                        <table border="0" cellpadding="0" cellspacing="0" width="100%"><tr>
                            <td width="40"></td>
                            <td>
                                <div style="border-bottom-width: 1px; border-bottom-color: #cccccc; border-bottom-style: solid;"></div>
                            </td>
                            <td width="40"></td>
                        </tr></table>
                    </td></tr>
                    <tr><td>
                        <table border="0" cellpadding="20" cellspacing="0"><tr>
                            <td>
                                <table border="0" cellpadding="0" cellspacing="0">
                                    <tr><td>
                                        <p style="font-family: Lato, sans-serif; margin: 0px;">Hi ${name},</p>
                                    </td></tr>
                                    <tr><td height="10"></td></tr>
                                    <tr><td>
                                        <p style="font-family: Lato, sans-serif; margin: 0px;">Welcome to Slate! To log in, you must first verify your email by clicking the button below:</p>
                                    </td></tr>
                                    <tr><td height="20"></td></tr>
                                    <tr><td>
                                        <table bgcolor="#0478f1" align="center" border="0" cellpadding="0" cellspacing="0" style="border-radius: 5px;"><tr><td>
                                            <a href="http://localhost:8080/verify?e=${query}" style="display: inline-block; text-decoration: none;">
                                                <table border="0" cellpadding="0" cellspacing="0">
                                                    <tr height="10"></tr>
                                                    <tr>
                                                        <td width="20"></td>
                                                        <td>
                                                            <p style="color: #ffffff; font-family: Lato, sans-serif; margin: 0px;">Verify e-mail</p>
                                                        </td>
                                                        <td width="20"></td>
                                                    </tr>
                                                    <tr height="10"></tr>
                                                </table>
                                            </a>
                                        </td></tr></table>
                                    </td></tr>
                                </table>
                            </td>
                        </tr></table>
                    </td></tr>
                </table>
            </></td></tr></table>
        </body>
    </html>
`;
