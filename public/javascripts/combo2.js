/*
	The combobox control.  This is very simililar to the local array
	autocompleter but with the addition that if a specified control
	(like an image) is clicked it will show a default list.
	Otherwise it behaves exactly like the local array autocompleter.

	The constructor is the same as the local array autocompleter.
	
	To specify a different array for the 'show default' control,
	add the option 'defaultArray', and pass to it a valid javascript array.
	This control won't work so well if the two arrays you pass in are 
	wildly different.  Generally you need to have the defaultArray be a 
	subset of the main array.
	
	I've commented in-line to help explain some of the choices.
	
	One last thing:  a 'super' would be *really* nice for stuff like this.
	There is a lot of dup code because I can't call super; or super.onBlur().
	I guess I could name the methods something different, and we can do that
	to keep the code DRY, but I left the dupe lines in to make it clear as to
	what is going on.
	
	An example (in html) is:
	<script type="text/javascript">
		//*horrible* baby names (first names!  try and guess which ones are for 
		// boys and girls.  ugh)
		var all_options = ['Ambrosia','Attica','Autumn Night','Avellana','Bow Hunter',
		'Brielle','Brooklynn','Cash','Cinsere','Crisiant','Cyndee','Delphine','Donte',
		'Drudwen','Dusk','Electra','Emmaleigh','Enfys','Enobi','Eurwen','Faerin',
		'Faleiry','Francessca','Franka','Fritha','Gage','Gaiety','Gennavieve','Gibson'];
		// the worst.  Ok, couldn't cull it down enough, so any 5
		var default_options = ['Avellana','Enobi','Eurwen','Faleiry','Gage'];

	</script> 
	TEST:<input type="text" id="name-field"/>
	<image id='name-arrow' src="/images/combo_box_arrow.png"/>
	<div class="auto_complete" id="lookup_auto_complete"></div> 
	<%= javascript_tag("new Autocompleter.Combobox('name-field',
	'lookup_auto_complete', 'name-arrow',
 	all_options,{partialChars:1, ignoreCase:true, fullSearch:true, frequency:0.1, 
							 choices:6, defaultArray:default_options, tokens: ',' });") %>
*/

Autocompleter.Combobox = Class.create();
Object.extend(Object.extend(Autocompleter.Combobox.prototype, Autocompleter.Local.prototype), {

	initialize: function(element, update, selectDefault, array, options) {
		this.baseInitialize(element, update, options);
		this.selectDefault = selectDefault;
		//this keeps track of whether or not the click is currently over the 'selectDefault'.  See
		// below for more detail.
		this.overSelectDefault = false;
		this.clickedSelectDefault = 0;
		
		this.options.array           = this.options.array || array;
		this.options.defaultArray    = this.options.defaultArray || this.options.array;
		this.options.defaultChoices  = this.options.defaultChoices || this.options.defaultArray.length;
		
		Event.observe(this.selectDefault, 'click', this.click.bindAsEventListener(this));		

		// these events are all in place to coordinate between te onBlur event for the input
		// field and the click event for the selectDefault.  See below for more detail.
    Event.observe(this.selectDefault, "mouseover", this.onMouseover.bindAsEventListener(this));
    Event.observe(this.selectDefault, "mouseout", this.onMouseout.bindAsEventListener(this));
    Event.observe(this.element, "keypress", this.resetClick.bindAsEventListener(this));
	},

/*
The one issue I had (and hence the extra Event.observers and this.overSelectDefault and this.clickedSelectDefault)
was that if you had the input field highlighted and clicked _anywhere_ outside the input field, the
'onBlur' method would be called.  This makes sense except in the case where you hit the 'selectDefault'
element, in which case you don't want to hide the dropdown but show it!

I first tried to see if the events were called in any particular order (deterministic).  I didn't
think this would work but I thought it was worth a shot.  The answer depends on the browser, but
most are non-deterministic.  Because they aren't called in a pre-defined order, that also meant
that you can't set a state flag in one (like 'I just clicked the selectDefault element!'), and expect
to check it in the other event ('hide me IF the selectDefault was not clicked!').

The other hope was that the event could give me information about either which element was
*active* when the event was triggered (this is different than asking which element is tied to the
event, which is given to you by prototype's Event.element), or the X,Y coordinates of the event to
see if I could compare that to the location of the selectDefault element (prototype's Position.within).

Neither of those worked.  Firefox has an attribute for events that tell you what element you were on
when the event was triggered.  IE supposedly has something similar, but opera and safari do not.  So
that won't work.  And, the onBlur event doesn't set the X and Y coordinates (or any of the numerous
position attributes) in either firefox or safari.  doah!

So the end solution was to set a flag on a mouseover and mouseout on the selectDefault element. 
The idea is that this will occur before a click and there will be time to set the flag before
the 'onClick' and 'onBlur' events are triggered simultaneously.  This works really well, but leaves one
last catch: sometimes when you click the selectDefault you *want* the default menu to disappear.  Hence
the reason to keep track of the state of the selectDefault element (previously clicked or not clicked).
*/

	onMouseover: function(event){
		this.overSelectDefault = true;
	},

	onMouseout: function(event){
		this.overSelectDefault = false;
	},
	
	resetClick :function(event) {
		this.clickedSelectDefault = 0;
	},
	
	onBlur: function(event, force) {
		if (this.overSelectDefault && !force)
		{
			//no need to blur
			return;
		}
		// this is where you can call super.onBlur();
	  setTimeout(this.hide.bind(this), 250);
	  this.hasFocus = false;
	  this.active = false;
	  this.clickedSelectDefault = false;
	},

	click: function(event) {
		this.clickedSelectDefault = Math.abs(this.clickedSelectDefault - 1);
		this.element.focus();
		this.changed = false;
		this.hasFocus = true;
		this.getAllChoices();
		if ( Element.getStyle(this.update, 'display') != 'none' && this.clickedSelectDefault != 1) {
			this.onBlur(event, true);
		}
	},

  // this is *almost* exactly the same as Autocompleter.local.selector method
  // there can definitely be some refactoring done in the control.js file
  // to keep it DRY
  // What I changed was that if the user hits the defaultSelect element, I 
  // *always* want to show all the elements in the defaultSelect 'dropdown'.
  // that way there is some consistency about what is shown when the user
  // hits that element.  
  // but to recognize that they might have already typed something in the 
  // input field, this function (like the one in Autocomplete.local) highlights
  // the matching chars, if there are any.
	getAllChoices: function(e) {
		  var ret       = []; // Beginning matches
      var partial   = []; // Inside matches
      var entry     = this.getToken();
      var count     = 0;
      for (var i = 0; i < this.options.defaultArray.length &&  
        ret.length < this.options.defaultChoices; i++) { 
        var elem = this.options.defaultArray[i];
        var foundPos = this.options.ignoreCase ? 
          elem.toLowerCase().indexOf(entry.toLowerCase()) : 
          elem.indexOf(entry);
				if (entry == "" || foundPos == -1)
				{
					ret.push("<li>" + elem + "</li>");
					continue;					
				}
        while (foundPos != -1) {
          if (foundPos == 0 && elem.length != entry.length) { 
            ret.push("<li><strong>" + elem.substr(0, entry.length) + "</strong>" + 
              elem.substr(entry.length) + "</li>");
            break;
          } else if (entry.length >= this.options.partialChars && 
            this.options.partialSearch && foundPos != -1) {
            if (this.options.fullSearch || /\s/.test(elem.substr(foundPos-1,1))) {
              partial.push("<li>" + elem.substr(0, foundPos) + "<strong>" +
                elem.substr(foundPos, entry.length) + "</strong>" + elem.substr(
                foundPos + entry.length) + "</li>");
              break;
            }
          }

          foundPos = this.options.ignoreCase ? 
            elem.toLowerCase().indexOf(entry.toLowerCase(), foundPos + 1) : 
            elem.indexOf(entry, foundPos + 1);

        }
      }
      if (partial.length)
      ret = ret.concat(partial.slice(0, this.options.defaultChoices - ret.length))
		this.updateChoices("<ul>" + ret.join('') + "</ul>");
	}
});