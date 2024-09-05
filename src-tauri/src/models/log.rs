use serde::{Deserialize, Serialize};
use uuid::Uuid;
use crate::models::imaging_session::ImagingSession;
use crate::models::imaging_frames;
#[derive(Debug, Serialize, Deserialize)]
pub struct TableData {
  pub sessions: Vec<LogTableRow>,
  pub calibration: Vec<CalibrationTableRow>
}

#[derive(Debug, Serialize, Deserialize)]
pub struct LogTableRow {
  id: Uuid,
  date: String,
  target: String,
  sub_length: f64,
  total_subs: i32,
  integrated_subs: i32,
  filter: String,
  gain: i32,
  offset: i32,
  camera_temp: f64,
  outside_temp: f64,
  average_seeing: f64,
  average_cloud_cover: f64,
  average_moon: f64,
  telescope: String,
  flattener: String,
  mount: String,
  camera: String,
  notes: String
}

impl LogTableRow {
  pub fn new(imaging_session: &ImagingSession) -> Self {
    let light_frame = imaging_frames::get_light_frame(&imaging_session.light_frame_id);

    LogTableRow {
      id: light_frame.id,
      date: light_frame.date,
      target: light_frame.target,
      sub_length: light_frame.sub_length,
      total_subs: light_frame.total_subs,
      integrated_subs: light_frame.integrated_subs,
      filter: String::from("L"),
      gain: light_frame.gain,
      offset: light_frame.offset,
      camera_temp: light_frame.camera_temp,
      outside_temp: light_frame.outside_temp,
      average_seeing: light_frame.average_seeing,
      average_cloud_cover: light_frame.average_cloud_cover,
      average_moon: light_frame.average_moon,
      telescope: String::from("Sky-Watcher Esprit 100ED"),
      flattener: String::from("Sky-Watcher 1.0x"),
      mount: String::from("Sky-Watcher EQ6-R Pro"),
      camera: String::from("ZWO ASI1600MM Pro"),
      notes: light_frame.notes,
    }
  }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CalibrationTableRow {
  id: Uuid,
  camera: String,
  calibration_type: String,
  gain: i32,
  sub_length: f64,
  camera_temp: f64,
  total_subs: i32
}

impl CalibrationTableRow {
  pub fn new(calibration_frame: Box<dyn imaging_frames::CalibrationFrame>) -> Self {
    CalibrationTableRow {
      id: *calibration_frame.id(),
      camera: String::from("default_camera"), // Placeholder, replace with actual data
      calibration_type: String::from("default_type"), // Placeholder, replace with actual data
      gain: 0, // Placeholder, replace with actual data
      sub_length: 0.0, // Placeholder, replace with actual data
      camera_temp: 0.0, // Placeholder, replace with actual data
      total_subs: 0, // Placeholder, replace with actual data
    }
  }
}
