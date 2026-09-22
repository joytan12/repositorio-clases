import unittest
from verificador_rut import calcular_digito_verificador, validar_rut, limpiar_rut, formatear_rut


class TestVerificadorRut(unittest.TestCase):

    def test_limpiar_rut(self):
        self.assertEqual(limpiar_rut("11.111.111-1"), "111111111")
        self.assertEqual(limpiar_rut(" 12.345.678-k "), "12345678K")
        self.assertEqual(limpiar_rut("12345678-9"), "123456789")

    def test_digito_verificador(self):
        # 11.111.111 -> 1
        self.assertEqual(calcular_digito_verificador("11111111"), "1")
        # 7.608.695 -> 8
        self.assertEqual(calcular_digito_verificador("7608695"), "8")
        # 10.000.001 -> K (1*3 + 1*2 = 5? No, sum: 1*2 + 0*3 + ... + 1*9? Let's check math)
        # Sum modulo 11 = 10 -> 11 - 10 = 1? No, 11 - (suma % 11) = 10 -> K.

    def test_validar_rut_correctos(self):
        # Casos con diferentes formatos válidos
        self.assertTrue(validar_rut("11.111.111-1")[0])
        self.assertTrue(validar_rut("11111111-1")[0])
        self.assertTrue(validar_rut("111111111")[0])
        self.assertTrue(validar_rut(" 11.111.111 - 1 ")[0])
        
        # RUT con K (ej: 10000002 -> 2*2 + 1*3 = 7 -> 11 - 7 = 4)
        # RUTs reales conocidos
        # 1-9 (RUT histórico 1 -> 1*2 = 2 -> 11 - 2 = 9)
        self.assertTrue(validar_rut("1-9")[0])
        # 2-7 (2*2 = 4 -> 11-4 = 7)
        self.assertTrue(validar_rut("2-7")[0])
        # 6-K (6*2 = 12 -> 12%11 = 1 -> 11-1 = 10 -> K)
        self.assertTrue(validar_rut("6-k")[0])
        self.assertTrue(validar_rut("6-K")[0])
        # 5-0 (5*2 = 10 -> 10%11 = 10 -> 11-10 = 1? No, 5*2=10 -> 11-10=1 -> DV 1)
        # Para DV 0: suma % 11 == 0 -> e.g. cuerpo 22 -> 2*2 + 2*3 = 10. 11*2=22 -> 0?
        # e.g. cuerpo 11 -> 1*2 + 1*3 = 5
        # e.g. cuerpo donde suma % 11 == 0: 27 -> 7*2 + 2*3 = 14+6 = 20
        # e.g. 88 -> 8*2 + 8*3 = 40.
        # e.g. cuerpo 00? No, un RUT con DV 0:
        # e.g. 29 -> 9*2 + 2*3 = 18 + 6 = 24.
        # e.g. 19 -> 9*2 + 1*3 = 18 + 3 = 21.
        # e.g. 70 -> 0*2 + 7*3 = 21.
        # e.g. 91 -> 1*2 + 9*3 = 29.
        # e.g. 75 -> 5*2 + 7*3 = 10 + 21 = 31.
        # e.g. 58 -> 8*2 + 5*3 = 16 + 15 = 31.
        # e.g. 14 -> 4*2 + 1*3 = 8 + 3 = 11 -> 11 % 11 = 0 -> DV = 0!
        self.assertEqual(calcular_digito_verificador("14"), "0")
        self.assertTrue(validar_rut("14-0")[0])

    def test_validar_rut_incorrectos(self):
        self.assertFalse(validar_rut("11.111.111-2")[0])
        self.assertFalse(validar_rut("14-9")[0])
        self.assertFalse(validar_rut("6-0")[0])
        self.assertFalse(validar_rut("")[0])
        self.assertFalse(validar_rut("abc-1")[0])
        self.assertFalse(validar_rut("12345-X")[0])

    def test_formatear_rut(self):
        self.assertEqual(formatear_rut("111111111"), "11.111.111-1")
        self.assertEqual(formatear_rut("140"), "14-0")
        self.assertEqual(formatear_rut("6K"), "6-K")


if __name__ == "__main__":
    unittest.main()
