/*	Copyright (c) 2016 Jean-Marc VIGLINO,
	released under the CeCILL-B license (French BSD license)
	(http://www.cecill.info/licences/Licence_CeCILL-B_V1-en.txt).
*/

import ol_ext_inherits from '../util/ext'
import ol_control_Toggle from './Toggle'
import ol_interaction_GeolocationDraw from '../interaction/GeolocationDraw'

/** Geolocation bar
 * The control bar is a container for other controls. It can be used to create toolbars.
 * Control bars can be nested and combined with ol.control.Toggle to handle activate/deactivate.
 *
 * @constructor
 * @extends {ol_control_Toggle}
 * @param {Object=} options ol.interaction.GeolocationDraw option.
 *  @param {String} options.className class of the control
 *  @param {number} options.delay delay before removing the location in ms, delfaut 3000 (3s)
 */
var ol_control_GeolocationButton = function(options) {
  if (!options) options = {};
  // Geolocation draw interaction
  options.followTrack = options.followTrack || 'auto';
  options.zoom = options.zoom || 16;
  //options.minZoom = options.minZoom || 16;
  var interaction = new ol_interaction_GeolocationDraw(options);

  ol_control_Toggle.call (this, {
    className: options.className = ((options.className || '') + ' ol-geobt').trim(),
    interaction: interaction,
    onToggle: function() {
      interaction.pause(true);
      interaction.setFollowTrack(options.followTrack || 'auto');
    }
  });
  this.setActive(false);

  // Timeout delay
  var tout;
  interaction.on('change:active', function() {
    if (tout) {
      clearTimeout(tout);
      tout = null;
    }
    if (interaction.getActive()) {
      tout = setTimeout(function() {
        interaction.setActive(false);
        tout = null;
      }, options.delay || 3000);
    }
  });
  
  // Activate
  var element = this.element;
  this.on('change:active', function(e) {
    if (e.active) {
      element.classList.add('ol-active');
    } else {
      element.classList.remove('ol-active');
    }
  });
};
ol_ext_inherits(ol_control_GeolocationButton, ol_control_Toggle);

export default ol_control_GeolocationButton
