class EngineeringController < ApplicationController
layout "main"

  def index
  	populate_sidebar("Engineering")
  	
	respond_to do |format|
	  format.html  # index.html.erb
	  format.xml  { render :xml => @models }
	end
  end
  
  def show_media
  	respond_to do |format|
  		format.js{
  			@gallery = Gallery.find(params[:id])
  			render :update do |page|
				 page.replace_html "Gallery_Media_" + params[:id].to_s, :partial => "show_media"
				 page.visual_effect :slide_down, "Gallery_Media_" + params[:id].to_s
			end
  		}
  	end
  end
  
  def hide_media
  	respond_to do |format|
  		format.js{
  			render :update do |page|
				page.visual_effect :blind_up, "Gallery_Media_" + params[:id].to_s
			end
  		}
  	end
  end
end
