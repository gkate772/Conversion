using Newtonsoft.Json.Linq;
using System.Text;

namespace GKConversionWeb.Classes
{
    public class JsonToCSharpClassGenerator
    {
        public static string GenerateCSharpClassesFromJson(string json)
        {
            string DyinamicClass = "";
            var token = JToken.Parse(json);
            //if (token is JObject)
            //{
            //    JObject jsonObject = (JObject)token;
            //    DyinamicClass = GenerateClass(jsonObject, "Root");

            //}

            DyinamicClass = GenerateClass(token, "Root");
            return DyinamicClass;
        }

        private static string GenerateClass(JObject jsonObject, string ClassName)
        {
            StringBuilder sb = new StringBuilder();
            sb.Append("public class ");
            sb.Append(ClassName);
            sb.Append("\n{");
            foreach (JProperty item in jsonObject.Properties())
            {
                sb.Append("\npublic ");
                sb.Append(GetTypeFromJTokenType(jsonObject[item.Path].Type) + "\n");
                sb.Append(item.Path);
                sb.Append("\n{ get; set; }");
            }
            sb.Append("\n}");
            return sb.ToString();
        }

        private static string GenerateClass(JToken token, string className)
        {
            StringBuilder sb = new StringBuilder();
            sb.Append("public class ");
            sb.Append(className);
            sb.Append("\n{");

            if (token is JObject jsonObject)
            {
                foreach (JProperty item in jsonObject.Properties())
                {
                    sb.Append("\npublic ");
                    sb.Append(GetTypeFromJTokenType(jsonObject[item.Name].Type) + "\n");
                    sb.Append(item.Name);
                    sb.Append("\n{ get; set; }");
                }
            }
            else if (token is JArray jsonArray)
            {
                // For arrays, generate a list of items
                sb.Append("\npublic List<object> Items { get; set; }");
            }
            else
            {
                // For other types (e.g., JValue), generate a property directly
                sb.Append("\npublic ");
                sb.Append(GetTypeFromJTokenType(token.Type) + "\n");
                sb.Append("Value { get; set; }");
            }

            sb.Append("\n}");
            return sb.ToString();
        }



        private static string GetTypeFromJTokenType(JTokenType type)
        {
            switch (type)
            {
                case JTokenType.None:
                    return "void";
                case JTokenType.Object:
                    return "object";
                case JTokenType.Array:
                    return "JArray";
                case JTokenType.Constructor:
                    return "JConstructor";
                case JTokenType.Property:
                    return "JProperty";
                case JTokenType.Comment:
                    return "JValue"; // Comments are represented as JValue
                case JTokenType.Integer:
                    return "int"; // Assuming long for Integer type
                case JTokenType.Float:
                    return "double"; // Assuming double for Float type
                case JTokenType.String:
                    return "string";
                case JTokenType.Boolean:
                    return "bool";
                case JTokenType.Null:
                    return "object"; // Null can be any type
                case JTokenType.Undefined:
                    return "object"; // Undefined can be any type
                case JTokenType.Date:
                    return "DateTime";
                case JTokenType.Raw:
                    return "string"; // Raw is represented as string
                case JTokenType.Bytes:
                    return "byte[]";
                case JTokenType.Guid:
                    return "Guid";
                case JTokenType.Uri:
                    return "Uri";
                case JTokenType.TimeSpan:
                    return "TimeSpan";
                default:
                    throw new ArgumentException($"Unknown JTokenType: {type}");
            }
        }


    }
}
