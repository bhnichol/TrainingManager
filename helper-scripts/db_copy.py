import oracledb

def get_connection(username, password, hostname, port, service_name):
    connection = oracledb.connect(user=username, password=password, dsn=f"{hostname}:{port}/{service_name}")
    return connection

def get_tables(connection):
    cursor = connection.cursor()
    cursor.execute("SELECT table_name FROM user_tables")
    tables = cursor.fetchall()
    return [table[0] for table in tables]

def get_table_schema(connection, table_name):
    cursor = connection.cursor()
    cursor.execute("SELECT dbms_metadata.get_ddl('TABLE', '{}') FROM dual".format(table_name))
    schema = cursor.fetchone()[0].read()
    return schema

def export_to_sql_file(filename, connection):
    with open(filename, 'w') as sql_file:
        tables = get_tables(connection)
        for table in tables:
            schema = get_table_schema(connection, table)
            sql_file.write("{};\n\n".format(schema))

# Replace with your database credentials
username = 'your_username'
password = 'your_password'
hostname = 'your_hostname'
port = 'your_port'
service_name = 'your_service_name'

connection = get_connection(username, password, hostname, port, service_name)
export_to_sql_file('exported_database.sql', connection)
connection.close()