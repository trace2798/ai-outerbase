import { FC } from "react";

interface UpdateProps {}

const Update: FC<UpdateProps> = ({}) => {
  async function createIndexAndEmbeddings() {
    try {
      const result = await fetch("/api/update", {
        method: "POST",
      });
      const json = await result.json();
      console.log("result: ", json);
    } catch (err) {
      console.log("err:", err);
    }
  }
  return (
    <>
      <button onClick={createIndexAndEmbeddings}>
        Create index and embeddings
      </button>
    </>
  );
};

export default Update;
