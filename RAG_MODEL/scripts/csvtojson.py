import pandas as pd
import json
import os

# --- Configuration ---
INPUT_FILE = "../dataset/archive (2)/megaGymDataset.csv" # The path to your CSV file
OUTPUT_FILE = "../dataset/processed/processed_data.json" # The final JSON file in processed folder

def main():
    print(f"Loading dataset from '{INPUT_FILE}'...")
    
    # 1. Load the CSV file using pandas
    try:
        # We use index_col=0 because your first column is the CSV's index
        df = pd.read_csv(INPUT_FILE, index_col=0)
    except FileNotFoundError:
        print(f"Error: The file '{INPUT_FILE}' was not found.")
        print("Please make sure it's in the same directory as this script.")
        return
    except Exception as e:
        print(f"An error occurred loading the CSV: {e}")
        return

    # 2. Handle missing data (like empty Rating or Desc)
    # We fill 'NaN' (Not a Number) values with empty strings to avoid errors
    df = df.fillna("")
    print(f"Loaded {len(df)} exercises. Processing...")

    all_processed_data = []

    # 3. Iterate over every row in the dataset
    for index, row in df.iterrows():
        
        # --- This is the "Semantic Chunking" ---
        # We combine the most important fields into one text blob.
        # This is what the vector database will search against.
        text_to_embed = (
            f"Exercise Title: {row['Title']}\n"
            f"Description: {row['Desc']}\n"
            f"Type: {row['Type']}\n"
            f"Body Part: {row['BodyPart']}\n"
            f"Equipment: {row['Equipment']}\n"
            f"Level: {row['Level']}"
        )
        
        # --- This is the Metadata ---
        # We store the other columns as metadata. This lets us
        # filter our search later (e.g., "Find exercises where Level='Intermediate'")
        metadata = {
            "source": INPUT_FILE,
            "title": row['Title'],
            "type": row['Type'],
            "body_part": row['BodyPart'],
            "equipment": row['Equipment'],
            "level": row['Level'],
            "rating": row['Rating']
        }
        
        # 4. Create the final JSON object for this row
        processed_doc = {
            "doc_id": f"megagym-{index}", # Create a unique ID from the CSV index
            "text_to_embed": text_to_embed,
            "metadata": metadata
        }
        
        all_processed_data.append(processed_doc)

    # 5. Save all processed data to the final .json file
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(all_processed_data, f, indent=2, ensure_ascii=False)

    print(f"\nSuccess! 🚀")
    print(f"Processed {len(all_processed_data)} documents.")
    print(f"Your processed file is ready: '{OUTPUT_FILE}'")

if __name__ == "__main__":
    main()