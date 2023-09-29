import { FC } from "react";
import { Button } from "./ui/button";

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
      <Button onClick={createIndexAndEmbeddings}>
        Create index and embeddings
      </Button>
    </>
  );
};

export default Update;
