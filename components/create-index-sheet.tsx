"use client";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SubmitHandler, useForm } from "react-hook-form";
import { useToast } from "./ui/use-toast";

type PromptFormValues = {
  name: string;
};

export function CreateIndexSheet() {
  const { toast } = useToast();

  const form = useForm<PromptFormValues>({
    // resolver: zodResolver(textSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit: SubmitHandler<PromptFormValues> = async (values) => {
    try {
      const response = await fetch(
        `COMMAND_URL_TO_CREATE_PINECONE_INDEX`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            name: values.name,
          }),
        }
      );
      //console.log(response);
      const data = await response.json();
      //console.log(data);
      toast({
        title: `${data}`,
        description: "Click to visit the page",
        variant: "default",
      });
      form.reset();
    } catch (error) {
      console.error(error);
      toast({
        title: "Error!",
        description: "Request could not be completed.",
        variant: "destructive",
      });
    }
  };
  const isLoading = form.formState.isSubmitting;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Create Index</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Create Index</SheetTitle>
          <SheetDescription>
            This command first checks if index with the provided name exist of
            not then it creates one.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col items-center gap-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col w-full grid-cols-12 gap-2 p-4 px-3 border rounded-lg md:px-6 focus-within:shadow-sm"
              >
                {" "}
                <FormField
                  name="name"
                  render={({ field }) => (
                    <FormItem className="col-span-12 lg:col-span-10">
                      <FormControl className="p-0 m-0">
                        <Input
                          className="w-full pl-3 border border-primary-foreground focus-visible:ring-0 focus-visible:ring-transparent "
                          disabled={isLoading}
                          placeholder="Enter the index name"
                          {...field}
                          required
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button
                  className="col-span-12 p-5 mt-5 w-fit lg:col-span-12"
                  type="submit"
                  disabled={isLoading}
                  size="icon"
                >
                  Create
                </Button>
              </form>
            </Form>
          </div>
        </div>
        <SheetFooter></SheetFooter>
        <div className="w-full space-y-4 md:mt-0">
          {isLoading && (
            <div className="flex items-center justify-center w-full p-3 ml-5 rounded-lg w-fill bg-muted">
              {/* <Loader description="Cohere is searching your query." /> */}
              <h1>Loading</h1>
            </div>
          )}
        </div>
        {/* {data} */}
      </SheetContent>
    </Sheet>
  );
}
