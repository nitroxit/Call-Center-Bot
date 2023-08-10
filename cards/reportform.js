let reportform = 
    {
        "type": "AdaptiveCard",
        "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
        "version": "1.0",
        "body": [
            {
                "type": "TextBlock",
                "text": "Call Center Issue Reporting",
                "wrap": true
            },
            {
                "type": "Input.ChoiceSet",
                "choices": [
                    {
                        "title": "Inbound",
                        "value": "inb"
                    },
                    {
                        "title": "Outbound",
                        "value": "outb"
                    }
                ],
                "placeholder": "Direction of Call",
                "style": "expanded",
                "label": "Direction of call:",
                "separator": true,
                "isRequired": true,
                "errorMessage": "No choice selected",
                "id": "dir"
            },
            {
                "type": "Input.Text",
                "placeholder": "End User Phone #",
                "style": "Tel",
                "id": "patnumber",
                "isRequired": true,
                "errorMessage": "Invalid #",
                "label": "End user phone #:"
            },
            {
                "type": "Input.Date",
                "label": "Date of Report:",
                "id": "date",
                "isRequired": true,
                "errorMessage": "Date is required."
            },
            {
                "type": "Input.Time",
                "label": "Time:",
                "id": "time",
                "isRequired": true,
                "errorMessage": "Time is required."
            },
            {
                "type": "Input.Number",
                "placeholder": "Agent phone #",
                "label": "Agent phone #",
                "id": "agentnum"
            },
            {
                "type": "Input.Text",
                "placeholder": "Agent Email",
                "label": "Agent Email",
                "style": "Email",
                "id": "agentemail"
            },
            {
                "type": "Input.Text",
                "placeholder": "Symptoms",
                "label": "Symptoms",
                "id": "symptoms"
            },
            {
                "type": "ActionSet",
                "actions": [
                    {
                        "type": "Action.Submit",
                        "title": "Submit",
                        "style": "positive"
                    }
                ],
                "spacing": "None",
                "horizontalAlignment": "Center"
            }
        ],
        "id": "reportform",
        "backgroundImage": {
            "url": "https://erad.com/wp-content/uploads/RadNet-Logo-NoTag-Large-Color.png",
            "horizontalAlignment": "Center",
            "verticalAlignment": "Center"
        }
    }


exports.reportform = reportform