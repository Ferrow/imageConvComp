const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const readline = require("readline");

// Function to convert and compress image
async function convertAndCompressImage(
  inputImagePath,
  outputImagePath,
  format,
  quality
) {
  await sharp(inputImagePath)
    .toFormat(format, { quality: quality })
    .toFile(outputImagePath);
}

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Ask user for format and quality
rl.question("Enter the format (png, jpg, webp): ", (format) => {
  rl.question("Enter the quality (0 to 100): ", (quality) => {
    // Specify the input folder path
    const inputFolder = "images";

    // Ask user for output folder name
    rl.question("Enter the output folder name: ", (outputFolderName) => {
      const outputFolderPath = path.join("output", outputFolderName);

      // Check if output folder exists
      if (fs.existsSync(outputFolderPath)) {
        // Ask user for confirmation if folder already exists
        rl.question(
          "Output folder already exists. Do you want to overwrite it? (y/n): ",
          (confirmation) => {
            if (confirmation.toLowerCase() === "y") {
              // Create output folder if it doesn't exist
              if (!fs.existsSync(outputFolderPath)) {
                fs.mkdirSync(outputFolderPath);
              }

              // Process each file in the folder
              fs.readdirSync(inputFolder).forEach((file) => {
                const inputImagePath = path.join(inputFolder, file);
                const outputImagePath = path.join(
                  outputFolderPath,
                  `${path.parse(file).name}.${format}`
                );

                // Convert and compress image
                convertAndCompressImage(
                  inputImagePath,
                  outputImagePath,
                  format,
                  parseInt(quality, 10)
                );
              });
            } else {
              console.log("Operation canceled.");
            }

            rl.close();
          }
        );
      } else {
        // Create output folder if it doesn't exist
        if (!fs.existsSync(outputFolderPath)) {
          fs.mkdirSync(outputFolderPath);
        }

        // Process each file in the folder
        fs.readdirSync(inputFolder).forEach((file) => {
          const inputImagePath = path.join(inputFolder, file);
          const outputImagePath = path.join(
            outputFolderPath,
            `${path.parse(file).name}.${format}`
          );

          // Convert and compress image
          convertAndCompressImage(
            inputImagePath,
            outputImagePath,
            format,
            parseInt(quality, 10)
          );
        });

        rl.close();
      }
    });
  });
});
