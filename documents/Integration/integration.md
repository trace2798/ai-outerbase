---
title: "Integration"
slug: "/integration"
hidden: false
createdAt: "2022-10-27T22:40:52.852Z"
updatedAt: "2023-08-22T20:38:42.840Z"
---

### Outerbase Usage

In this application outerbase commands have been use for various purposes. The ways it has been use are: to get the text embedding of an input value from OpenAI, to query pinecone with those embeddings to get answer of the question asked by the user. A command was also used to create a index in pinecone.


### Command to emebed using OpenAI

```javascript
async function userCode() {
  try {
    const inputValue = '{{request.body.inputValue}}'
    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `YOUR_API_KEY_OPENAI`
      },
      body: JSON.stringify({
        input: inputValue,
        model: 'text-embedding-ada-002'
      })
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    } else {
      const jsonResponse = await response.json();
      const embeddingValue = jsonResponse.data[0].embedding;
      return embeddingValue;
    }
  } catch (error) {
    console.log(error);
  }
}

```