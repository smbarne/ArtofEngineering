class GalleryMedia < ActiveRecord::Base
	belongs_to :gallery
		
	file_column :medianame, :magick => {
		:versions => {"thumb" => "125x125","medium" => "132x132", "maximum" => "1024x800", "artmaximum" => "1280x1024" }
		}, :in => ["gif", "jpg", "png", "bmp"]
		
end
