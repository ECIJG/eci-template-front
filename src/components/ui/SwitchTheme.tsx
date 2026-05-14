"use client"

import useMounted from '@/src/hooks/UseMounted';
import { Switch } from '@heroui/react';
import { useTheme } from 'next-themes';
import Icon from './Icon';

const SwitchTheme = () => {
    const mounted = useMounted();
    const { theme, setTheme } = useTheme();

    if (!mounted) return null;

    return (
        <>
            <Switch
                size='lg'
                isSelected={theme === "dark"}
                onChange={() => setTheme(theme === "light" ? "dark" : "light")}
            >
                <Switch.Control className='h-[30px] w-[51px]'>
                    <Switch.Thumb className='h-[27px] mb-[0.5px]'>
                        <Switch.Icon >
                            <span
                                key={theme}
                                className='animate-[iconFlip_200ms_ease-out_1]'
                            >
                                <Icon icon={theme === "light" ? "sun-fill" : "moon-fill"} />
                            </span>
                        </Switch.Icon>
                    </Switch.Thumb>
                </Switch.Control>
            </Switch>
        </>
    )
}

export default SwitchTheme