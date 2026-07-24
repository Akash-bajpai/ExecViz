"use client";

import CodeEditor from "@/components/CodeEditor";

export default function Home(): JSX.Element {
  return (
    <Editor
      height="100%"
      defaultLanguage="java"
      theme="vs-dark"
      defaultValue={`public class Main {

    public static void main(String[] args) {

        int a = 5;
        int b = 10;

        int c = a + b;

        System.out.println(c);

    }

}`}
      options={{
        fontSize: 16,
        minimap: {
          enabled: false,
        },
        automaticLayout: true,
      }}
    />
  );
}