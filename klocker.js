#! /usr/bin/env node

import fs from "fs";
import crypto from "crypto";
import chalk from "chalk";
import prompts from "prompts";
import packageJson from "./package.json" assert { type: "json" };

const __version__ = packageJson.version ?? "0.0.0-err";

/**
 * Klock - Kadir's Lock
 *
 * An easy, clean and fast way to encrypt your files via command line.
 * @version 0.0.1
 * @author Kadir
 */
async function main() {
  console.clear();
  console.log(chalk.blue(chalk.bold(`Klocker - ${__version__}`)));

  const { password, choice, inputFile, outputFile } = await prompts([
    {
      type: "password",
      name: "password",
      message: "Enter a password:",
      validate: (value) =>
        value.length >= 6 || "Password must be at least 6 characters.",
    },
    {
      type: "select",
      name: "choice",
      message: "Select an operation:",
      choices: [
        { title: "File Encryption", value: "encrypt" },
        { title: "File Decryption", value: "decrypt" },
      ],
    },
    {
      type: "text",
      name: "inputFile",
      message: "Enter the input file name:",
    },
    {
      type: "text",
      name: "outputFile",
      message: "Enter the output file name:",
    },
  ]);

  if (choice === "encrypt") {
    if (inputFile && outputFile) {
      const cipher = crypto.createCipher("aes-256-cbc", password);

      const input = fs.createReadStream(inputFile);
      const output = fs.createWriteStream(outputFile);

      input.pipe(cipher).pipe(output);

      output.on("finish", () => {
        console.log(chalk.green("File encryption completed."));
      });
    } else {
      console.log(
        chalk.red("Please provide input and output file names for encryption.")
      );
    }
  } else if (choice === "decrypt") {
    if (inputFile && outputFile) {
      const decipher = crypto.createDecipher("aes-256-cbc", password);

      const input = fs.createReadStream(inputFile);
      const output = fs.createWriteStream(outputFile);

      input.pipe(decipher).pipe(output);

      output.on("finish", () => {
        console.log(chalk.green("File decryption completed."));
      });
    } else {
      console.log(
        chalk.red("Please provide input and output file names for decryption.")
      );
    }
  }
}

main();
