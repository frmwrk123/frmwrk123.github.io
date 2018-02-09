---
layout: post
title:  "OpenProject 7 auf Uberspace 6 zum Laufen bekommen"
date:   2017-12-26 18:00:00 +0200
categories: blog
---

OpenProject ist ein sehr gutes Projektmanagement-Tool, welches gleich mehrere
Anforderungen erfüllt:

- online und damit von allen im Team jederzeit abrufbar
- Unterstützung für beliebig viele Nutzer\*innen
- kostenlos
- funktioniert ohne Rootrechte

Im <a href="https://wiki.uberspace.de" rel="nofollow">Uberspace-Wiki</a> gibt es einen 
Abschnitt "Coole Sachen", wo auch eine
<a href="https://gist.github.com/tessi/466308e59e117d9fb34e" rel="nofollow">Anleitung für Open Project 6</a> 
verlinkt ist. Ich versuchte dieser zu folgen,
stieß aber an einigen Stellen auf Probleme. Daher folgt hier nun eine Anleitung,
die für die aktuelle Version 6 von Uberspace funktioniert. Uberspace 7 konnte ich
nicht nutzen, da dort Ruby noch nicht zur Verfügung steht.

## Abhängigkeiten installieren

1. Zunächst erstellt ihr eine ``.gemrc`` mit folgendem Inhalt: ``gem: --user-install --no-rdoc --no-ri``.
   Damit sagt ihr Ruby, dass die Gems in dem User Directory installiert werden sollen.
2. Erstellt unter ``~/etc/`` eine Datei ``rubyversion`` mit dem Inhalt: ``RUBYVERSION=2.4.1``.
   Mit dieser Datei legt ihr die zu nutzende Rubyversion auf 2.4.1 fest. Eine neuere Version
   gibt es zum aktuellen Zeitpunkt auf Uberspace 6 nicht.
3. Fügt in eurer ``.bash_profile`` am Ende folgendes hinzu: ``export PATH=/package/host/localhost/nodejs-9/bin:$PATH``
   Damit wird die NodeJS Version auf 9 gesetzt. Standardmäßig wird noch eine sehr 
   alte Version verwendet. Um die Änderungen zu laden, benutzt ``source .bash_profile``.
4. Überprüft die Einstellungen mit ``ruby --version``, was 2.4.1 ergeben sollte.

Das war es. Keine weiteren Schritte sind zu diesem Zeitpunkt nötig.

## OpenProject installieren

Führt folgende Anweisungen aus, wobei jede Zeile einzeln in das Terminal eingegeben
werden sollte. Wenn ihr gleich gewisse Standardplugins dabei haben wollt, dann nehmt
im Folgenden die auskommentierte Zeile und kommentiert die erste ``git clone``-Zeile aus.

```bash
mkdir apps; cd apps
git clone https://github.com/opf/openproject.git --branch stable/7 --depth 1
# git clone https://github.com/opf/openproject-ce.git --branch stable/7 --depth 1 openproject
cd openproject
git checkout stable
gem install bundler
# bearbeite die Gemfile-Datei und setze am Anfang bei der Rubyversion 2.4.1 ein
bundle install --deployment --without postgres sqlite development test therubyracer docker
npm install
```

## OpenProject konfigurieren

Als nächstes müssen wir OpenProject konfigurieren. Dafür erstellen wir zunächst
die Datenbankkonfiguration und bearbeiten sie im Anschluss:

```bash
# wir befinden uns weiterhin in ~/apps/openproject
cp config/database.yml.example config/database.yml
```

Die Zugangsdaten für MySQL finden sich in der ``.my.cnf``-Datei im Homeverzeichnis.
Diese müssen jetzt eingetragen werden.

```yaml
# config/database.yml
# ...
production:
  adapter: mysql2
  database: <uberspace user>
  host: localhost
  username: <uberspace user>
  password: <secret>
  encoding: utf8
# ...
development:
  adapter: mysql2
  database: <uberspace user>_development
  host: localhost
  username: <uberspace user>
  password: <secret>
  encoding: utf8
# ...
test:
  adapter: mysql2
  database: <uberspace user>_test
  host: localhost
  username: <uberspace user>
  password: <secret>
  encoding: utf8
# ...
```
OpenProject benötigt einen offenen Port. Dieser muss erst einmal geöffnet werden.

```bash
uberspace-add-port -p tcp --firewall
# dieser Befehl wird als Antwort verraten, welcher Port geöffnet wurde
# diesen Port bitte merken
```

Als nächstes bearbeiten wir die ``config/configuration.yml`` bzw. erstellen sie,
wenn es sie noch nicht gibt.

```yaml
production:
   email_delivery_method: "smtp"
   smtp_address: "<uberspace user>@<host>.uberspace.de"
   smtp_port: 587
   smtp_authentication: :login
   smtp_domain: '<host>.uberspace.de'
   smtp_user_name: '<uberspace user>'
   smtp_password: '<SSH password>'
   host_name: 'localhost:<geöffneter Port>' # unklar, ob benötigt; im Zweifel übernehmen
   protocol: https
rails_cache_store: :memcache
```

## Installation von OpenProject finalisieren

Wenn eine andere Sprache als Englisch benötigt wird, dann die auskommentierte
Zeile für den seed verwenden und die Locale angeben.

```bash
# wir befinden uns in ~/apps/openproject
RAILS_ENV="production" ./bin/rake db:create
RAILS_ENV="production" ./bin/rake db:migrate
RAILS_ENV="production" ./bin/rake db:seed
# RAILS_ENV="production" LOCALE=en ./bin/rake db:seed
RAILS_ENV="production" ./bin/rake assets:precompile
```

Damit OpenProject vernünftig laufen kann, wird ein Secret Token verwendet.
Dieses generieren wir im nächsten Schritt.

```bash
echo "export SECRET_KEY_BASE=$(./bin/rake secret)" >> ~/.bash_profile
source ~/.bash_profile
```

Die öffentlichen Assets müssen auch noch in ein Verzeichnis gepackt werden, 
welches für den Webserver zugänglich ist. Also wird dieser Befehl verwendet:

```bash
cp -r public/* ~/html/
```

## OpenProject starten

Schließlich müssen wir noch OpenProject als Daemon einrichten. Falls dies ein
ganz frischer Uberspace ist (empfohlen), müssen wir diese Möglichkeit
erst noch einrichten.

```bash
test -d ~/service || uberspace-setup-svscan
# create openproject-web
cat <<__EOF__ > ~/bin/openproject-web
#!/bin/sh
# This is needed to find gems installed with --user-install
export HOME=$HOME
# Get into the project directory and start the Rails server
cd \$HOME/apps/openproject
exec bundle exec unicorn --port <port> --env production
__EOF__
chmod +x ~/bin/openproject-web
uberspace-setup-service openproject-web ~/bin/openproject-web
# create openproject-worker
cat <<__EOF__ > ~/bin/openproject-worker
#!/bin/sh
# This is needed to find gems installed with --user-install
export HOME=$HOME
# we're faster and use the right database in production
export RAILS_ENV=production
# Get into the project directory and start the Rails server
cd \$HOME/apps/openproject
exec bundle exec rake jobs:work
__EOF__
chmod +x ~/bin/openproject-worker
uberspace-setup-service openproject-worker ~/bin/openproject-worker
```

Ganz zum Schluss muss dem Apache Server noch gesagt werden, dass auf den 
geöffneten Port umgeleitet werden soll.

```bash
cat > ~/html/.htaccess <<__EOF__
RewriteEngine On
RewriteCond %{HTTPS} !=on
RewriteCond %{ENV:HTTPS} !=on
RewriteRule .* https://%{SERVER_NAME}%{REQUEST_URI} [R=301,L]

RewriteRule (.*) http://localhost:<port>/$1 [P]
__EOF__
```

## OpenProject aufrufen

Die Installation ist zu diesem Zeitpunkt soweit fertig. Als nächstes muss die
Website aufgerufen werden. Die Zugangsdaten des standardmäßig erstellten Nutzers
sind beim ersten Mal ``admin`` als Username und ``admin`` als Passwort.

Mit diesen Schritten sollte die Installation funktionieren. damit HTTPS funktioniert,
lese bitte die entsprechenden Seiten im <a href="https://wiki.uberspace.de/webserver:https" rel="nofollow">Uberspace-Wiki</a>.
