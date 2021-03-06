/**
 * gnome-shell-extension-SkypeNotification
 * Skype GnomeShell Integration.
 *  
 * This file is part of gnome-shell-extension-SkypeNotification.
 *
 * gnome-shell-ext-SkypeNotification is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * gnome-shell-ext-SkypeNotification  is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with gnome-shell-ext-SkypeNotification  If not, see <http://www.gnu.org/licenses/>.
 *
 */

const Gio = imports.gi.Gio;
const Gtk = imports.gi.Gtk;

const Me = imports.misc.extensionUtils.getCurrentExtension();

const _ = imports.gettext.domain(Me.uuid).gettext;

const SETTINGS_SHOW_PANEL_BUTTON_KEY = "show-top-bar-icon";
const SETTINGS_OPEN_CONTACTS_ON_LEFT_CLICK_KEY = "open-contacts-on-top-bar-icon-left-click";


let settings;
function init() {
    imports.gettext.bindtextdomain(Me.uuid, Me.path + "/locale");
    const GioSSS = Gio.SettingsSchemaSource;

    let schemaSource = GioSSS.new_from_directory(Me.path + "/schemas", 
            GioSSS.get_default(), false);

    let schemaObj = schemaSource.lookup(Me.metadata["settings-schema"], true);
    if(!schemaObj) {
        throw new Error("Schema " + Me.metadata["settings-schema"] + " could not be found for extension " +
                        Me.uuid + ". Please check your installation.");
    }

    settings = new Gio.Settings({ settings_schema: schemaObj });
}

function buildPrefsWidget() {
    let frame = new Gtk.Box({
        orientation: Gtk.Orientation.VERTICAL,
        border_width: 10
    });

    let vbox = new Gtk.Box({
        orientation: Gtk.Orientation.VERTICAL,
        margin: 20,
        margin_top: 10
    });


    let hbox = new Gtk.Box({
        orientation: Gtk.Orientation.HORIZONTAL
    });

    let showIconLabel = new Gtk.Label({
        label: _("Show top bar icon"),
        xalign: 0
    });

    let showIconSwitch = new Gtk.Switch({
        active: settings.get_boolean(SETTINGS_SHOW_PANEL_BUTTON_KEY)
    });
    showIconSwitch.connect("notify::active", function(button) {
        settings.set_boolean(SETTINGS_SHOW_PANEL_BUTTON_KEY, button.active);
    });

    showIconLabel.set_tooltip_text(_("Shall the top bar icon be displayed"));
    showIconSwitch.set_tooltip_text(_("Shall the top bar icon be displayed"));

    hbox.pack_start(showIconLabel, true, true, 0);
    hbox.add(showIconSwitch);

    vbox.add(hbox);


    let hbox = new Gtk.Box({
        orientation: Gtk.Orientation.HORIZONTAL
    });

    let onLeftClickLabel = new Gtk.Label({
        label: _("Open contacts on left click on top bar icon"),
        xalign: 0
    });

    let onLeftClickSwitch = new Gtk.Switch({
        active: settings.get_boolean(SETTINGS_OPEN_CONTACTS_ON_LEFT_CLICK_KEY)
    });
    onLeftClickSwitch.connect("notify::active", function(button) {
        settings.set_boolean(SETTINGS_OPEN_CONTACTS_ON_LEFT_CLICK_KEY, button.active);
    });

    onLeftClickLabel.set_tooltip_text(_("Shall the Skype contact list be opened when the top bar icon is clicked by the left mouse button"));
    onLeftClickSwitch.set_tooltip_text(_("Shall the Skype contact list be opened when the top bar icon is clicked by the left mouse button"));

    hbox.pack_start(onLeftClickLabel, true, true, 0);
    hbox.add(onLeftClickSwitch);

    vbox.add(hbox);


    frame.add(vbox);
    frame.show_all();
    return frame;
}
