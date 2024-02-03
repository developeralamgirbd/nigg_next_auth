export const default_qa_prompt = `Basierend auf folgenden Dokumenten, beantworte folgende Frage: \n
Frage: <<{query}>> \n
Ermittle zuerst die Sprache, in der diese Frage (zwischen << und >>) gestellt wurde - gib diese Information jedoch nicht aus.\n
Nutze nur die Informationen aus dem Kontext - und füge keine zusätzlichen Warnhinweise an.\n
Solltest du tabellenartige Strukturen finden, formatiere diese zuerst als Tabelle und beantworte erst danach die Frage.\n
Sind im Text Hinweise auf Abbildungen vorhanden, entferne diese - wir können keine Abbildungen darstellen \n
Die Antwort sollte so umfänglich wie möglich sein \n
Solltest du eine Antwort finden, gib bitte an, welches der Dokumente und welche Seite für das Finden der Antwort am nützlichsten war.\n
Sollte die Antwort aus JIRA Tickets entnommen werden, entferne die Seitangabe \n
Liefere alle Antworten nur in jener Sprache, in der die Frage (zwischen << und >>) gestellt wurde.\n

Kontext: \n`

export const default_system_prompt = `Use the following pieces of context to answer the users question in the language the question was asked in. \n
In which language is the question asked?\n
If you don't know the answer, just say that you don't know, don't try to make up an answer - don't add additional warnings or remarks. \n
If you find table-like structures, format them as a table and only then answer the question. Only use the tables for you as input - do not directly print the tables.\n
Format the answer in markdown. \n
If you find an answer, please indicate which document or ticket was most useful for finding the answer.\n
-----\n
Context: \n
`

export const conversational_prompt= `Given the following conversation history, use the users follow up question to create a standalone question without referring to a specific pdf document, in it's original language. \n
The standalone question needs to contain all the information from the chat history so that it can be understood without seeing the conversation history.\n
----\n
Chat history: {history}\n
----\n
Follow-up question: {query}\n
----\n
Standalone question: `

export const classification_prompt = `Du bekommst ein Set an Maschinen-Dokumentationen.\n
Klassifiziere dabei die Frage des Nutzers.\n
Die Klassifizierungs-Optionen sind:\n\n

1. Allgemeine Benützung: Wenns um Fragen geht, die Benutzung der Maschine betreffen. Beispiel: Wie tausche ich..., wie kann man xyz befüllen\n
2. Technische Details: Wenns um technische Details oder Spezifikationen der Maschine oder von Bauteilen geht. Beispiel: Was ist die Anschlussleistung, wie schwer ist...\n
3. Wartung: Wenns um Wartung der Maschine oder Bauteilen geht. Beispiel: Was muss man jährlich warten\n
3. Inhaltsverzeichnis: Fragen nach 'wo finde ich..' \n\n

Zusätzlich, wähle aus untenstehenden Quellen jene, die am Wahrscheinlichsten zur Beantwortung der Frage dienlich sind\n
1. General: User Manual, Einstellanleitungen, Wartungsanleitungen
2. Tickets: JIRA Tickets, beantworten spezifische Probleme rund um die Maschine
`
