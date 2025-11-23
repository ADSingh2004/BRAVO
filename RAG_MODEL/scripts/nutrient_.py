import pandas as pd
import json
import os

# --- Configuration ---
# Path to nutrition.csv in the dataset/nutrition.csv folder
INPUT_FILE = "../dataset/nutrition.csv/nutrition.csv" 
# Saves the output to the processed folder
OUTPUT_FILE = "../dataset/processed/nutrition_data.json"
def main():
    print(f"Loading nutrition dataset from '{INPUT_FILE}'...")
    
    # 1. Load the CSV file using pandas
    try:
        # index_col=0 is used because your snippet shows a leading index column
        df = pd.read_csv(INPUT_FILE, index_col=0) 
    except FileNotFoundError:
        print(f"❌ Error: The file '{INPUT_FILE}' was not found.")
        print("Please make sure it's in the 'dataset' folder.")
        return
    except Exception as e:
        print(f"An error occurred loading the CSV: {e}")
        return

    # 2. Handle missing data
    # We fill 'NaN' (Not a Number) values with an empty string
    # or 0 for numeric fields to be safe.
    df = df.fillna("")
    print(f"Loaded {len(df)} food items. Processing...")

    # Create the output directory if it doesn't exist
    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)

    all_processed_data = []

    # 3. Iterate over every row in the dataset
    for index, row in df.iterrows():
        
        # --- This is our "Semantic Chunk" ---
        # We select the most important, searchable fields for the
        # text blob that we will embed.
        try:
            text_to_embed = (
                f"Food: {row['name']}\n"
                f"Serving Size: {row['serving_size']}\n"
                f"Calories: {row['calories']} kcal\n"
                f"Protein: {row['protein']}\n"
                f"Total Fat: {row['total_fat']}\n"
                f"Carbohydrates: {row['carbohydrate']}\n"
                f"Fiber: {row['fiber']}\n"
                f"Sugars: {row['sugars']}"
            )
            
            # --- This is the Metadata ---
            # We convert the *entire* row into a dictionary.
            # This stores all 60+ nutrients (vitamins, minerals, etc.)
            # for the LLM to use *after* retrieval.
            metadata = row.to_dict()
            
            # Add source file as good practice
            metadata["source_file"] = os.path.basename(INPUT_FILE)
            
            # 4. Create the final JSON object for this row
            processed_doc = {
                "doc_id": f"nutrition-{index}", # Create a unique ID
                "text_to_embed": text_to_embed,
                "metadata": metadata
            }
            
            all_processed_data.append(processed_doc)
            
        except KeyError as e:
            print(f"⚠️ Warning: Skipping row {index} due to missing key: {e}")
        except Exception as e:
            print(f"⚠️ Warning: Skipping row {index} due to unexpected error: {e}")


    # 5. Save all processed data to the final .json file
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(all_processed_data, f, indent=2, ensure_ascii=False)

    print(f"\nSuccess! 🚀")
    print(f"Processed {len(all_processed_data)} documents.")
    print(f"Your processed file is ready: '{OUTPUT_FILE}'")

if __name__ == "__main__":
    main()