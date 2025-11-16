import { useState, useEffect } from "react";
import { Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

const ApiKeyConfig = () => {
  const [apiKey, setApiKey] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [hasKey, setHasKey] = useState(false);

  useEffect(() => {
    const savedKey = localStorage.getItem('openai_api_key');
    setHasKey(!!savedKey);
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, []);

  const handleSave = () => {
    if (!apiKey.trim()) {
      toast.error("Por favor, insira uma chave API válida");
      return;
    }

    if (!apiKey.startsWith('sk-')) {
      toast.error("Chave API inválida. Deve começar com 'sk-'");
      return;
    }

    localStorage.setItem('openai_api_key', apiKey);
    setHasKey(true);
    setIsOpen(false);
    toast.success("Chave API configurada com sucesso!");
  };

  const handleRemove = () => {
    localStorage.removeItem('openai_api_key');
    setApiKey("");
    setHasKey(false);
    setIsOpen(false);
    toast.success("Chave API removida");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant={hasKey ? "outline" : "default"}
          size="sm"
          className="gap-2"
        >
          <Key className="h-4 w-4" />
          {hasKey ? "Chave Configurada" : "Configurar API Key"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Configurar OpenAI API Key</DialogTitle>
          <DialogDescription>
            Insira sua chave API da OpenAI para habilitar o chat com IA.
            Você pode obter uma em{" "}
            <a 
              href="https://platform.openai.com/api-keys" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary underline"
            >
              platform.openai.com
            </a>
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="apiKey">API Key</Label>
            <Input
              id="apiKey"
              type="password"
              placeholder="sk-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          {hasKey && (
            <Button variant="destructive" onClick={handleRemove}>
              Remover
            </Button>
          )}
          <Button onClick={handleSave}>
            Salvar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApiKeyConfig;
