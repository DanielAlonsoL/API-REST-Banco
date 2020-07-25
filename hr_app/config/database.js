module.exports = {
  hrPool: {
    user: 'banco',
    password:'banco',
    connectString: '(DESCRIPTION=(ADDRESS_LIST =(ADDRESS = (PROTOCOL = TCP)(HOST = localhost)(PORT = 1521)))(CONNECT_DATA =(SERVICE_NAME = dalbd2.fi.unam)))',
    poolMin: 10,
    poolMax: 10,
    poolIncrement: 0
  }
};
