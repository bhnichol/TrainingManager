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
    cursor.execute(f"SELECT dbms_metadata.get_ddl('TABLE', '{table_name}') FROM dual")
    schema = cursor.fetchone()[0].read()
    return schema

def get_table_data(connection, table_name):
    cursor = connection.cursor()
    cursor.execute(f"SELECT * FROM {table_name}")
    columns = [col[0] for col in cursor.description]
    rows = cursor.fetchall()
    return columns, rows

def convert_data(value):
    if value is None:
        return 'NULL'
    elif isinstance(value, str):
        return "'{}'".format(value.replace("'", "''"))
    elif isinstance(value, (int, float)):
        return str(value)
    elif isinstance(value, oracledb.Date):
        return f"TO_DATE('{value.strftime('%Y-%m-%d %H:%M:%S')}', 'YYYY-MM-DD HH24:MI:SS')"
    else:
        return 

def generate_insert_statements(table_name, columns, rows):
    insert_statements = []
    for row in rows:
        values = ', '.join(convert_data(value) for value in row)
        insert_statement = f"INSERT INTO {table_name} ({', '.join(columns)}) VALUES ({values});"
        insert_statements.append(insert_statement)
    return insert_statements

def export_to_sql_file(filename, connection):
    with open(filename, 'w') as sql_file:
        tables = get_tables(connection)
        for table in tables:
            schema = get_table_schema(connection, table)
            sql_file.write(f"{schema};\n\n")
            
            columns, rows = get_table_data(connection, table)
            insert_statements = generate_insert_statements(table, columns, rows)
            for statement in insert_statements:
                sql_file.write(f"{statement}\n")
            sql_file.write("\n\n")

# Replace with your database credentials
username = 'trainingapp'
password = 'trainingapp'
hostname = 'localhost'
port = '1521'
service_name = 'XEPDB1'

connection = get_connection(username, password, hostname, port, service_name)
export_to_sql_file('exported_database.sql', connection)
connection.close()