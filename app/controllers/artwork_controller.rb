class ArtworkController < ApplicationController
#before_filter :login_required
layout "main"
			    
  def index
  	populate_sidebar("Artwork")
  	
	respond_to do |format|
	  format.html  # index.html.erb
	end
  end
  
  def show
    	populate_sidebar("Artwork")
  	@gallery = Gallery.find(params[:id])
	@medias = GalleryMedia.find(:all, :conditions => ["gallery_id = ?", @gallery.id], :order => "created_at DESC").paginate(:page => params[:page], :per_page => 20)
  	
  	respond_to do |format|
	  format.html {
		render :partial => "show_artwork", :layout => "main"
	  }
	end
  end
  
  end
