source comp.sh front
cp front.war ../Librairies/apache-tomcat-11.0.1/webapps/.
cd back_project_appli_web
./mvnw package
cd -
cp back_project_appli_web/target/back_project_appli_web-0.0.1-SNAPSHOT.war ../Librairies/apache-tomcat-11.0.1/webapps/back.war

