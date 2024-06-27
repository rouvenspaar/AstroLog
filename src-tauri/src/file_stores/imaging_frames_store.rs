use std::fs::File;
use std::io::Read;
use serde_json::from_str;
use crate::models::imaging_frames::ImagingFrameList;

pub fn load(filename: &str) -> Result<ImagingFrameList, Box<dyn std::error::Error>> {
    // Open the file in read-only mode
    let mut file = File::open(filename)?;

    // Read the file contents into a string
    let mut contents = String::new();
    file.read_to_string(&mut contents)?;

    // Deserialize the JSON string into EquipmentList
    let imaging_frame_list: ImagingFrameList = from_str(&contents)?;

    Ok(imaging_frame_list)
}